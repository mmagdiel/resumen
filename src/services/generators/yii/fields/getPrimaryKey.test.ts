import { getPrimaryKey } from "./getPrimaryKey";
import { describe, expect, it } from "vitest";

describe("getPrimaryKey", () => {
  const name = "status";
  const type = "string";
  it("should work", () => {
    const actualResult = getPrimaryKey({ name, type, isPrimaryKey: true });
    const expectedResult = ":primaryKey";
    expect(actualResult).toBe(expectedResult);
  });

  it("should don't work", () => {
    const actualResult = getPrimaryKey({ name, type });
    const expectedResult = "";
    expect(actualResult).toBe(expectedResult);
  });
});
