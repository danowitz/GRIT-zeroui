import _ from "lodash";
import axios from "axios";

import { api } from "../utils/controller-api.js";
import { db } from "../utils/db.js";
import { defaultRulesSource } from "../utils/constants.js";

export async function getNetworkAdditionalData(data) {
  let additionalData = db
    .get("networks")
    .find({ id: data.id })
    .get("additionalConfig");

  if (!additionalData.value()) {
    createNetworkAdditionalData(data.id);
  }

  delete data.rulesSource;
  delete data.objtype;
  delete data.revision;
  delete data.remoteTraceLevel;
  delete data.remoteTraceTarget;

  return {
    id: data.id,
    clock: new Date().getTime(),
    ...additionalData.value(),
    config: data,
  };
}

export async function getNetworksData(nwids) {
  const prefix = "/controller/network/";
  const links = nwids.map((nwid) => prefix + nwid);

  const multipleRes = await axios
    .all(links.map((l) => api.get(l)))
    .then(
      axios.spread(function (...res) {
        return res;
      })
    )
    .catch(function () {
      return [];
    });

  let data = Promise.all(
    multipleRes.map((el) => {
      return getNetworkAdditionalData(el.data);
    })
  );

  return data;
}

export async function createNetworkAdditionalData(nwid, data = {}) {
  const saveData = {
    id: nwid,
    additionalConfig: {
      description: data.description || "",
      rulesSource: data.rulesSource || defaultRulesSource,
      tagsByName: data.tagsByName || {},
      capabilitiesByName: data.capabilitiesByName || {},
    },
    members: [],
  };

  db.get("networks").push(saveData).write();
}

/**
 * Get one network with its ZeroUI metadata.
 * @param {string} nwid - ZeroTier network ID.
 * @returns {Promise<object | undefined>} The combined network record, if present.
 */
export async function getNetwork(nwid) {
  const data = await getNetworksData([nwid]);
  return data[0];
}

export async function updateNetworkAdditionalData(nwid, data) {
  let additionalData = {};

  if (data.hasOwnProperty("description")) {
    additionalData.description = data.description;
  }
  if (data.hasOwnProperty("rulesSource")) {
    additionalData.rulesSource = data.rulesSource;
  }
  if (data.hasOwnProperty("tagsByName")) {
    additionalData.tagsByName = data.tagsByName;
  }
  if (data.hasOwnProperty("capabilitiesByName")) {
    additionalData.capabilitiesByName = data.capabilitiesByName;
  }

  if (additionalData) {
    db.get("networks")
      .filter({ id: nwid })
      .map("additionalConfig")
      .map((additionalConfig) => _.assign(additionalConfig, additionalData))
      .write();
  }
}

export async function deleteNetworkAdditionalData(nwid) {
  db.get("networks").remove({ id: nwid }).write();
}
