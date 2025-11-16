import { getUnsigned } from "./getUnsigned";
import { describe, expect, it } from "vitest";

describe("getUnsigned", () => {
  const name = "status";
  const type = "string";
  it("should work", () => {
    const actualResult = getUnsigned({ name, type, isUnsigned: true });
    const expectedResult = ":unsigned";
    expect(actualResult).toBe(expectedResult);
  });

  it("should don't work", () => {
    const actualResult = getUnsigned({ name, type });
    const expectedResult = "";
    expect(actualResult).toBe(expectedResult);
  });
});
