import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

test("embedded ZeroUI reports its full document height to GRIT Cloud", () => {
  const messages = [];
  const observers = [];
  const body = { scrollHeight: 1018, offsetHeight: 1000 };
  const documentElement = { scrollHeight: 1056, offsetHeight: 1040 };
  const document = {
    body,
    documentElement,
    referrer: "https://gritautomation.cloud/#!/zerotier-monitor",
    addEventListener(_event, callback) {
      callback();
    },
  };
  const parent = {
    postMessage(message, origin) {
      messages.push({ message, origin });
    },
  };
  const window = {
    self: {},
    top: {},
    parent,
    addEventListener() {},
  };
  class ResizeObserver {
    constructor(callback) {
      this.callback = callback;
      observers.push(this);
    }
    observe() {
      this.callback();
    }
  }
  window.ResizeObserver = ResizeObserver;

  vm.runInNewContext(
    fs.readFileSync(
      new URL("../../public/grit-iframe-resize.js", import.meta.url),
      "utf8"
    ),
    { document, MutationObserver: undefined, ResizeObserver, URL, window }
  );

  assert.ok(observers.length > 0);
  assert.equal(messages[0].origin, "https://gritautomation.cloud");
  assert.equal(messages[0].message.type, "grit-dash-height");
  assert.equal(messages[0].message.height, 1056);
});
