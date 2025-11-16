import { getPrimaryKey } from "./getPrimaryKey";
import { describe, expect, it } from "vitest";

describe("getPrimaryKey", () => {
  const name = "status";

  it("should work", () => {
    const type = "integer";
    const actualResult = getPrimaryKey({ name, type, isPrimaryKey: true });
    const expectedResult = "status:primaryKey";
    expect(actualResult).toBe(expectedResult);
  });

  it("should work", () => {
    const type = "string";
    const actualResult = getPrimaryKey({ name, type, isPrimaryKey: true });
    const expectedResult = "status:bigPrimaryKey";
    expect(actualResult).toBe(expectedResult);
  });
});
