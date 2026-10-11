import assert from "node:assert/strict";
import test from "node:test";

process.env.ZU_CONTROLLER_TOKEN = "test-token";
const { api } = await import("./controller-api.js");

test("controller requests are bounded", () => {
  assert.equal(api.defaults.timeout, 10_000);
});
