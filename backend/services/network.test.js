import test, { after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const dataDirectory = fs.mkdtempSync(
  path.join(os.tmpdir(), "zero-ui-network-")
);
process.env.ZU_DATAPATH = path.join(dataDirectory, "db.json");
process.env.ZU_CONTROLLER_TOKEN = "test-controller-token";

const { db } = await import("../utils/db.js");
const { createNetworkAdditionalData, markNetworkAccessed } = await import(
  "./network.js"
);

after(() => fs.rmSync(dataDirectory, { recursive: true, force: true }));

test("new network metadata persists its supplied description", async () => {
  db.defaults({ networks: [] }).write();

  await createNetworkAdditionalData("4601bd822e123456", {
    description: "GRIT factory attempt receipt",
  });

  assert.equal(
    db
      .get("networks")
      .find({ id: "4601bd822e123456" })
      .get("additionalConfig.description")
      .value(),
    "GRIT factory attempt receipt"
  );
});

test("marking a network accessed persists the timestamp used by list sorting", async () => {
  db.set("networks", []).write();
  await createNetworkAdditionalData("4601bd822e123456");

  const lastAccessedAt = await markNetworkAccessed(
    "4601bd822e123456",
    1_795_027_200_000
  );

  assert.equal(lastAccessedAt, 1_795_027_200_000);
  assert.equal(
    db
      .get("networks")
      .find({ id: "4601bd822e123456" })
      .get("additionalConfig.lastAccessedAt")
      .value(),
    1_795_027_200_000
  );
});
