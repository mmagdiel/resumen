import { getForeignKey } from "./getForeignKey";
import { describe, expect, it } from "vitest";

describe("getForeignKey", () => {
  const name = "status";
  const type = "string";
  it("should work", () => {
    const isForeignKey = true;
    const referencesTable = "status";
    const attrs = { name, type, isForeignKey, referencesTable };
    const actualResult = getForeignKey(attrs);
    const expectedResult = ":foreignKey(status)";
    expect(actualResult).toBe(expectedResult);
  });

  it("should return foreign key when isForeignKey is true", () => {
    const isForeignKey = true;
    const referencesTable = "status";
    const attrs = { name, type, isForeignKey, referencesTable };
    const actualResult = getForeignKey(attrs);
    const expectedResult = ":foreignKey(status)";
    expect(actualResult).toBe(expectedResult);
  });

  it("should return empty string when isForeignKey is false", () => {
    const isForeignKey = false;
    const referencesTable = "users";
    const attrs = { name, type, isForeignKey, referencesTable };
    const actualResult = getForeignKey(attrs);
    const expectedResult = "";
    expect(actualResult).toBe(expectedResult);
  });

  it("should return empty string when isForeignKey is true but referencesTable is empty", () => {
    const isForeignKey = true;
    const referencesTable = "";
    const attrs = { name, type, isForeignKey, referencesTable };
    const actualResult = getForeignKey(attrs);
    const expectedResult = "";
    expect(actualResult).toBe(expectedResult);
  });

  it("should return empty string when isForeignKey is true but referencesTable is undefined", () => {
    const isForeignKey = true;
    const referencesTable = undefined;
    const attrs = { name, type, isForeignKey, referencesTable };
    const actualResult = getForeignKey(attrs);
    const expectedResult = "";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle table names with underscores", () => {
    const isForeignKey = true;
    const referencesTable = "user_profiles";
    const attrs = { name, type, isForeignKey, referencesTable };
    const actualResult = getForeignKey(attrs);
    const expectedResult = ":foreignKey(user_profiles)";
    expect(actualResult).toBe(expectedResult);
  });
});
