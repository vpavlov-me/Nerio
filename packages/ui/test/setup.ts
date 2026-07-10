import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(cleanup);

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: () => null,
});
