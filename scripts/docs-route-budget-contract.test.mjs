import assert from "node:assert/strict";
import test from "node:test";
import { routeBudgetFailures } from "./docs-route-budget-contract.mjs";

const route = { route: "/docs/example", jsBytes: 100, cssBytes: 50, transferBytes: 40 };

test("accepts complete finite route allowances", () => {
  assert.deepEqual(
    routeBudgetFailures([route], {
      routes: { "/docs/example": { jsBytes: 100, cssBytes: 50, transferBytes: 40 } },
    }),
    [],
  );
});

test("rejects missing and misspelled route budget fields", () => {
  assert.deepEqual(routeBudgetFailures([route], null), ["/docs/example: missing route budget"]);
  assert.deepEqual(
    routeBudgetFailures([route], {
      routes: { "/docs/example": { jsBytes: 100, cssByte: 50, transferBytes: 40 } },
    }),
    ["/docs/example: cssBytes budget must be a finite nonnegative number"],
  );
});

test("rejects negative, non-finite, and exceeded allowances", () => {
  assert.deepEqual(
    routeBudgetFailures([route], {
      routes: {
        "/docs/example": { jsBytes: -1, cssBytes: Number.NaN, transferBytes: 39 },
      },
    }),
    [
      "/docs/example: jsBytes budget must be a finite nonnegative number",
      "/docs/example: cssBytes budget must be a finite nonnegative number",
      "/docs/example: transferBytes 40/39 bytes",
    ],
  );
});
