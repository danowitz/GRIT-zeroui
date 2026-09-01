import express from "express";
const router = express.Router();

import * as auth from "../services/auth.js";
import * as network from "../services/network.js";

import { api } from "../utils/controller-api.js";
import { defaultRules } from "../utils/constants.js";
import { getZTAddress } from "../utils/zt-address.js";
import {
  createNetwork as createManagedNetwork,
  deleteNetwork as deleteManagedNetwork,
} from "../services/network-lifecycle.js";

const CONTROLLER_ADDRESS_UNAVAILABLE =
  "ZeroTier controller address is unavailable";
const CONTROLLER_NETWORK_PATH = "controller/network/";
const CONTROLLER_REQUEST_TIMEOUT_MS = 10_000;

// get all networks
router.get("/", auth.isAuthorized, async function (req, res) {
  api.get("controller/network").then(async function (controllerRes) {
    const nwids = controllerRes.data;
    const data = await network.getNetworksData(nwids);
    res.send(data);
  });
});

// get network
router.get("/:nwid", auth.isAuthorized, async function (req, res) {
  const nwid = req.params.nwid;
  const data = await network.getNetworksData([nwid]);
  if (data[0]) {
    res.send(data[0]);
  } else {
    res.status(404).send({ error: "Network not found" });
  }
});

/**
 * Build the network-creation route with replaceable controller dependencies.
 * @param {object} [options] route dependencies
 * @param {any} [options.controllerApi] ZeroTier controller API client
 * @param {() => Promise<string | undefined>} [options.getControllerAddress] controller identity lookup
 * @param {any} [options.networkService] persisted ZeroUI network metadata service
 * @param {any} [options.createNetwork] managed network lifecycle function
 * @param {string} [options.rules] default ZeroTier rules JSON
 * @returns {(req: any, res: any) => Promise<any>} Express route handler
 */
export function createNetworkHandler(options = {}) {
  const controllerApi = options.controllerApi || api;
  const getControllerAddress = options.getControllerAddress || getZTAddress;
  const networkService = options.networkService || network;
  const createNetwork = options.createNetwork || createManagedNetwork;
  const rules = options.rules || defaultRules;
  return async function (req, res) {
    if (!req.body || !req.body.config) {
      return res.status(400).send({ error: "Bad request" });
    }

    let controllerAddress;
    try {
      controllerAddress = await getControllerAddress();
    } catch {
      return res.status(503).send({
        error: CONTROLLER_ADDRESS_UNAVAILABLE,
      });
    }
    if (!/^[\da-f]{10}$/.test(String(controllerAddress || ""))) {
      return res.status(503).send({
        error: CONTROLLER_ADDRESS_UNAVAILABLE,
      });
    }

    let allocatedNetworkId;
    try {
      const data = await createNetwork(req.body, {
        controller: {
          create: async (config) => {
            let controllerRes;
            try {
              controllerRes = await controllerApi.post(
                CONTROLLER_NETWORK_PATH + controllerAddress + "______",
                { ...config, rules: JSON.parse(rules) },
                { timeout: CONTROLLER_REQUEST_TIMEOUT_MS }
              );
            } catch (err) {
              const upstream = /** @type {{response?: {status?: number}}} */ (
                err
              );
              const failure = Object.assign(
                new Error("ZeroTier controller rejected network creation"),
                {
                  httpStatus: 502,
                  upstreamStatus:
                    upstream.response && upstream.response.status,
                }
              );
              throw failure;
            }
            allocatedNetworkId = String(
              (controllerRes.data && controllerRes.data.id) || ""
            );
            if (!/^[\da-f]{16}$/.test(allocatedNetworkId)) {
              throw Object.assign(
                new Error(
                  "ZeroTier controller returned an invalid network identity"
                ),
                { httpStatus: 502 }
              );
            }
            return controllerRes.data;
          },
        },
        store: networkService,
      });
      if (!data) {
        return res.status(502).send({
          error: "ZeroTier network was created but could not be read back",
          networkId: allocatedNetworkId,
        });
      }
      return res.send(data);
    } catch (err) {
      const failure = /** @type {{httpStatus?: number, upstreamStatus?: number, message?: string}} */ (
        err
      );
      const status = failure.httpStatus || 500;
      return res.status(status).send({
        error:
          status === 500
            ? "ZeroUI could not persist the created network"
            : failure.message,
        ...(failure.upstreamStatus
          ? { upstreamStatus: failure.upstreamStatus }
          : {}),
        ...(allocatedNetworkId ? { networkId: allocatedNetworkId } : {}),
      });
    }
  };
}

// create new network
router.post("/", auth.isAuthorized, createNetworkHandler());

// update network
router.post("/:nwid", auth.isAuthorized, async function (req, res) {
  const nwid = req.params.nwid;
  network.updateNetworkAdditionalData(nwid, req.body);
  if (req.body.config) {
    api
      .post(CONTROLLER_NETWORK_PATH + nwid, req.body.config)
      .then(async function () {
        const data = await network.getNetworksData([nwid]);
        res.send(data[0]);
      })
      .catch(function (err) {
        res.status(500).send({ error: err.message });
      });
  } else {
    const data = await network.getNetworksData([nwid]);
    res.send(data[0]);
  }
});

// delete network
router.delete("/:nwid", auth.isAuthorized, async function (req, res) {
  const nwid = req.params.nwid;
  try {
    const result = await deleteManagedNetwork(nwid, {
      controller: {
        delete: async (id) => api.delete(CONTROLLER_NETWORK_PATH + id),
      },
      store: network,
    });
    return res.status(result.status).send("");
  } catch (err) {
    return res.status(500).send({
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

export default router;
