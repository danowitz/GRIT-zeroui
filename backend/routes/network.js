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

let ZT_ADDRESS = null;
getZTAddress().then(function (address) {
  ZT_ADDRESS = address;
});

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

// create new network
router.post("/", auth.isAuthorized, async function (req, res) {
  if (!req.body.config) {
    return res.status(400).send({ error: "Bad request" });
  }
  try {
    const data = await createManagedNetwork(req.body, {
      controller: {
        create: async (config) => {
          const response = await api.post(
            "controller/network/" + ZT_ADDRESS + "______",
            { ...config, rules: JSON.parse(defaultRules) }
          );
          return response.data;
        },
      },
      store: network,
    });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

// update network
router.post("/:nwid", auth.isAuthorized, async function (req, res) {
  const nwid = req.params.nwid;
  network.updateNetworkAdditionalData(nwid, req.body);
  if (req.body.config) {
    api
      .post("controller/network/" + nwid, req.body.config)
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
        delete: async (id) => api.delete("controller/network/" + id),
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
