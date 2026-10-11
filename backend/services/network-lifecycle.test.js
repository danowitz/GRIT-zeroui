import test from "node:test";
import assert from "node:assert/strict";

import { createNetwork, deleteNetwork } from "./network-lifecycle.js";

const NETWORK_ID = "4601bd822e123456";
const DESCRIPTION = "GRIT factory attempt receipt";
const NETWORK_CONFIG = { name: "Fells, David", private: true };

function networkStore() {
  const networks = new Map();

  return {
    networks,
    async createNetworkAdditionalData(id, data) {
      networks.set(id, {
        id,
        description: data.description || "",
        config: data.config,
      });
    },
    async deleteNetworkAdditionalData(id) {
      networks.delete(id);
    },
    async getNetwork(id) {
      return networks.get(id);
    },
  };
}

test("network creation retains top-level metadata in the returned network", async () => {
  const store = networkStore();
  const controller = {
    async create(config) {
      return { id: NETWORK_ID, config };
    },
  };

  const created = await createNetwork(
    {
      description: DESCRIPTION,
      config: NETWORK_CONFIG,
    },
    { controller, store }
  );

  assert.deepEqual(created, {
    id: NETWORK_ID,
    description: DESCRIPTION,
    config: NETWORK_CONFIG,
  });
  assert.deepEqual(await store.getNetwork(created.id), created);
});

test("failed controller deletion retains network metadata for a safe retry", async () => {
  const store = networkStore();
  await store.createNetworkAdditionalData(NETWORK_ID, {
    description: DESCRIPTION,
    config: NETWORK_CONFIG,
  });
  const controller = {
    async delete() {
      throw new Error("controller unavailable");
    },
  };

  await assert.rejects(
    deleteNetwork("4601bd822e123456", { controller, store }),
    /controller unavailable/
  );

  const retained = await store.getNetwork(NETWORK_ID);
  assert.equal(retained.description, DESCRIPTION);
});

test("successful controller deletion removes network metadata", async () => {
  const store = networkStore();
  await store.createNetworkAdditionalData(NETWORK_ID, {
    description: DESCRIPTION,
    config: NETWORK_CONFIG,
  });
  const controller = {
    async delete() {
      return { status: 200 };
    },
  };

  const result = await deleteNetwork(NETWORK_ID, {
    controller,
    store,
  });

  assert.equal(result.status, 200);
  assert.equal(await store.getNetwork(NETWORK_ID), undefined);
});

test("deleting an already absent controller network removes stale metadata", async () => {
  const store = networkStore();
  await store.createNetworkAdditionalData(NETWORK_ID, {
    description: DESCRIPTION,
    config: NETWORK_CONFIG,
  });
  const controller = {
    async delete() {
      throw Object.assign(new Error("not found"), {
        response: { status: 404 },
      });
    },
  };

  const result = await deleteNetwork(NETWORK_ID, {
    controller,
    store,
  });

  assert.equal(result.status, 204);
  assert.equal(await store.getNetwork(NETWORK_ID), undefined);
});
