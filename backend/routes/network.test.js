import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test, { after } from "node:test";

const testDatabasePath = path.join(
  tmpdir(),
  `grit-zeroui-network-${randomUUID()}.json`
);
process.env.ZU_DATAPATH = testDatabasePath;
process.env.ZU_CONTROLLER_TOKEN = "test-token";
const { createNetworkHandler } = await import("./network.js");

after(() => rmSync(testDatabasePath, { force: true }));

function responseRecorder() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
  };
}

test("network creation resolves the controller address for every request", async () => {
  const addresses = [undefined, "4601bd822e"];
  const posts = [];
  let metadataCreates = 0;
  const handler = createNetworkHandler({
    getControllerAddress: async () => addresses.shift(),
    controllerApi: {
      post: async (url, body, options) => {
        posts.push({ url, body, options });
        return { data: { id: "4601bd822e123456" } };
      },
    },
    networkService: {
      createNetworkAdditionalData: async () => {
        metadataCreates++;
      },
      getNetwork: async () => ({ id: "4601bd822e123456" }),
    },
    rules: "[]",
  });

  const firstResponse = responseRecorder();
  await handler(
    { body: { config: { name: "first", private: true } } },
    firstResponse
  );
  assert.equal(firstResponse.statusCode, 503);
  assert.deepEqual(firstResponse.body, {
    error: "ZeroTier controller address is unavailable",
  });
  assert.equal(posts.length, 0);
  assert.equal(metadataCreates, 0);

  const secondResponse = responseRecorder();
  await handler(
    { body: { config: { name: "second", private: true } } },
    secondResponse
  );
  assert.equal(secondResponse.statusCode, 200);
  assert.deepEqual(secondResponse.body, { id: "4601bd822e123456" });
  assert.equal(posts.length, 1);
  assert.equal(posts[0].url, "controller/network/4601bd822e______");
  assert.deepEqual(posts[0].body, {
    name: "second",
    private: true,
    rules: [],
  });
  assert.deepEqual(posts[0].options, { timeout: 10_000 });
  assert.equal(metadataCreates, 1);
});

test("network creation exposes a stable upstream failure instead of an opaque 500", async () => {
  const upstreamFailure = /** @type {Error & {response: {status: number}}} */ (
    new Error("Request failed with status code 404")
  );
  upstreamFailure.response = { status: 404 };
  const handler = createNetworkHandler({
    getControllerAddress: async () => "4601bd822e",
    controllerApi: {
      post: async () => {
        throw upstreamFailure;
      },
    },
    networkService: {},
    rules: "[]",
  });
  const response = responseRecorder();

  await handler(
    { body: { config: { name: "GRIT Hub", private: true } } },
    response
  );

  assert.equal(response.statusCode, 502);
  assert.deepEqual(response.body, {
    error: "ZeroTier controller rejected network creation",
    upstreamStatus: 404,
  });
});

test("network creation reports an unreadable allocation for exact replay", async () => {
  const handler = createNetworkHandler({
    getControllerAddress: async () => "4601bd822e",
    controllerApi: {
      post: async () => ({ data: { id: "4601bd822e654321" } }),
    },
    networkService: {
      createNetworkAdditionalData: async () => {},
      getNetwork: async () => undefined,
    },
    rules: "[]",
  });
  const response = responseRecorder();

  await handler(
    { body: { config: { name: "GRIT Hub", private: true } } },
    response
  );

  assert.equal(response.statusCode, 502);
  assert.deepEqual(response.body, {
    error: "ZeroTier network was created but could not be read back",
    networkId: "4601bd822e654321",
  });
});

test("network creation reports metadata persistence failure for exact replay", async () => {
  const handler = createNetworkHandler({
    getControllerAddress: async () => "4601bd822e",
    controllerApi: {
      post: async () => ({ data: { id: "4601bd822eabcdef" } }),
    },
    networkService: {
      createNetworkAdditionalData: async () => {
        throw new Error("disk unavailable");
      },
      getNetwork: async () => {
        throw new Error("must not read after failed persistence");
      },
    },
    rules: "[]",
  });
  const response = responseRecorder();

  await handler(
    { body: { config: { name: "GRIT Hub", private: true } } },
    response
  );

  assert.equal(response.statusCode, 500);
  assert.deepEqual(response.body, {
    error: "ZeroUI could not persist the created network",
    networkId: "4601bd822eabcdef",
  });
});
