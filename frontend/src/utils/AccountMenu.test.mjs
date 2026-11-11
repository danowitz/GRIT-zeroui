import assert from "node:assert/strict";
import test from "node:test";

import { accountMenuItems } from "./AccountMenu.mjs";

test("a logged-out user gets no account links", () => {
  assert.deepEqual(accountMenuItems({ loggedIn: false, disabledAuth: false }), []);
});

test("a logged-in user can reach Settings and Log out", () => {
  assert.deepEqual(accountMenuItems({ loggedIn: true, disabledAuth: false }), [
    "settings",
    "logOut",
  ]);
});

test("with authentication disabled there is nothing to log out of", () => {
  assert.deepEqual(accountMenuItems({ loggedIn: true, disabledAuth: true }), [
    "settings",
  ]);
});
