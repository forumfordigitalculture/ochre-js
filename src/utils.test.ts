import { expect, test } from "vitest";
import { hello } from "./utils.js";

test("hello", () => {
  expect(hello("world")).toBe("Hello, world!");
});
