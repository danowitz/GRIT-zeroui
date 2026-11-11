import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import { isEmbedded } from "./Embedded.mjs";

test("isEmbedded detects standalone, same-origin and cross-origin frames", () => {
  const standalone = {};
  standalone.self = standalone;
  standalone.top = standalone;
  assert.equal(isEmbedded(standalone), false);

  const framed = { top: {} };
  framed.self = framed;
  assert.equal(isEmbedded(framed), true);

  const crossOrigin = {
    get self() {
      return this;
    },
    get top() {
      throw new Error("cross-origin");
    },
  };
  assert.equal(isEmbedded(crossOrigin), true);
});

test("embedded ZeroUI still offers a log in button when the header bar is hidden", () => {
  const read = (path) =>
    fs.readFileSync(new URL(path, import.meta.url), "utf8");
  const app = read("../App.jsx");
  const loggedOut = read("../components/HomeLoggedOut/HomeLoggedOut.jsx");

  // The header bar (the only other home for the log in button) is hidden
  // inside GRIT Cloud, so the logged-out page must render it itself.
  assert.match(app, /\{embedded \? <EmbeddedAccountMenu \/> : <Bar \/>\}/);
  assert.match(loggedOut, /isEmbedded\(\) && \(\s*<Box mt=\{2\}>\s*<LogIn \/>/);
});

test("embedded ZeroUI offers log in on every logged-out page, not only home", () => {
  const read = (path) =>
    fs.readFileSync(new URL(path, import.meta.url), "utf8");
  const notAuthorized = read("../components/NotAuthorized/NotAuthorized.jsx");

  assert.match(notAuthorized, /isEmbedded\(\) && \(\s*<Box mt=\{2\}>\s*<LogIn \/>/);
  for (const route of ["Network/Network.jsx", "Settings/Settings.jsx"]) {
    assert.match(read("../routes/" + route), /return <NotAuthorized \/>;/);
  }
});
