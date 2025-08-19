import { getRequired } from "./getRequired";
import { describe, expect, it } from "vitest";

describe("getRequired", () => {
  const name = "status";
  const type = "string";
  it("should work", () => {
    const actualResult = getRequired({ name, type, isRequired: true });
    const expectedResult = ":notNull";
    expect(actualResult).toBe(expectedResult);
  });

  it("should don't work", () => {
    const actualResult = getRequired({ name, type });
    const expectedResult = "";
    expect(actualResult).toBe(expectedResult);
  });
});
