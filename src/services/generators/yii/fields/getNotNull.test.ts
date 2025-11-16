import { getNotNull } from "./getNotNull";
import { describe, expect, it } from "vitest";

describe("getNotNull", () => {
  const name = "status";
  const type = "string";
  it("should work", () => {
    const actualResult = getNotNull({ name, type, isNotNull: true });
    const expectedResult = ":notNull";
    expect(actualResult).toBe(expectedResult);
  });

  it("should don't work", () => {
    const actualResult = getNotNull({ name, type });
    const expectedResult = "";
    expect(actualResult).toBe(expectedResult);
  });
});
