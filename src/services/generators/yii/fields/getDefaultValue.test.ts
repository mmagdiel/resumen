import { expect, it, describe } from "vitest";
import { getDefaultValue } from "./getDefaultValue";

describe("getDefaultValue", () => {
  const name = "status";
  const type = "string";
  it("getDefaultValue with string default value", () => {
    const defaultValue = "draft";
    const actualResult = getDefaultValue({ defaultValue, name, type });
    const expectedResult = ":defaultValue(draft)";
    expect(actualResult).toBe(expectedResult);
  });

  it("getDefaultValue with numeric default value", () => {
    const defaultValue = 0;
    const actualResult = getDefaultValue({ defaultValue, name, type });
    const expectedResult = ":defaultValue(0)";
    expect(actualResult).toBe(expectedResult);
  });

  it("getDefaultValue with no default value", () => {
    const actualResult = getDefaultValue({ name, type });
    const expectedResult = "";
    expect(actualResult).toBe(expectedResult);
  });

  it("getDefaultValue with null default value", () => {
    const defaultValue = null;
    const actualResult = getDefaultValue({ defaultValue, name, type });
    const expectedResult = "";
    expect(actualResult).toBe(expectedResult);
  });

  it("getDefaultValue with undefined default value", () => {
    const defaultValue = undefined;
    const actualResult = getDefaultValue({ defaultValue, name, type });
    const expectedResult = "";
    expect(actualResult).toBe(expectedResult);
  });
});
