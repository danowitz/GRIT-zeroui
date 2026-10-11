import assert from "node:assert/strict";
import test from "node:test";

import { findHubIp, sortNetworks } from "./NetworkList.mjs";

test("findHubIp returns an IPv4 address only for a node named Hub", () => {
  const members = [
    {
      name: "Joel laptop",
      config: { ipAssignments: ["172.30.55.4"] },
    },
    {
      name: "Carpenter Hub",
      config: { ipAssignments: ["fd00::1", "172.30.55.58"] },
    },
  ];

  assert.equal(findHubIp(members), "172.30.55.58");
  assert.equal(findHubIp([members[0]]), null);
});

test("recent sorting puts the most recently accessed network first", () => {
  const networks = [
    { id: "never", config: { name: "Never", creationTime: 300 } },
    { id: "older", lastAccessedAt: 100, config: { name: "Older" } },
    { id: "newer", lastAccessedAt: 200, config: { name: "Newer" } },
  ];

  assert.deepEqual(
    sortNetworks(networks, "recent").map((network) => network.id),
    ["newer", "older", "never"]
  );
});
