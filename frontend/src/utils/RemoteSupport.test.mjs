import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import fs from "node:fs";

test("Remote Support sends only a typed action and network id to the exact Cloud parent", async () => {
  const source =
    fs
      .readFileSync(new URL("./RemoteSupport.mjs", import.meta.url), "utf8")
      .replace(/export /g, "") +
    "\nthis.requestRemoteSupport=requestRemoteSupport;";
  const calls = [];
  const context = {
    document: { referrer: "https://gritautomation.cloud/#!/zerotier-monitor" },
    window: { parent: { postMessage: (...args) => calls.push(args) } },
    URL,
    Set,
  };
  vm.runInNewContext(source, context);
  assert.equal(context.requestRemoteSupport("4601BD822E123456", "ssh"), true);
  assert.deepEqual(JSON.parse(JSON.stringify(calls[0][0])), {
    type: "grit-support-action",
    networkId: "4601bd822e123456",
    action: "ssh",
  });
  assert.equal(calls[0][1], "https://gritautomation.cloud");
  assert.equal(context.requestRemoteSupport("bad", "ssh"), false);
  assert.equal(
    context.requestRemoteSupport("4601bd822e123456", "command"),
    false
  );
});
