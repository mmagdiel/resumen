import { getUnique } from "./getUnique";
import { describe, expect, it } from "vitest";

describe("getUnique", () => {
  const name = "status";
  const type = "string";
  it("should work", () => {
    const actualResult = getUnique({ name, type, isUnique: true });
    const expectedResult = ":unique";
    expect(actualResult).toBe(expectedResult);
  });

  it("should don't work", () => {
    const actualResult = getUnique({ name, type });
    const expectedResult = "";
    expect(actualResult).toBe(expectedResult);
  });
});
