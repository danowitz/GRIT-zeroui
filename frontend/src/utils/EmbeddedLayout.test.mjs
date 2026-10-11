import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("embedded ZeroUI uses the full parent content width", () => {
  const app = fs.readFileSync(new URL("../App.jsx", import.meta.url), "utf8");
  const homeStyles = fs.readFileSync(
    new URL(
      "../components/HomeLoggedIn/HomeLoggedIn.styles.jsx",
      import.meta.url
    ),
    "utf8"
  );

  assert.match(app, /classList\.toggle\("grit-embedded", embedded\)/);
  assert.match(homeStyles, /"html\.grit-embedded &"/);
  assert.match(homeStyles, /maxWidth: "none"/);
  assert.match(homeStyles, /padding: 0/);
});
