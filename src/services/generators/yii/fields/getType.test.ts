import { getType } from "./getType";
import { describe, expect, it } from "vitest";

describe("getType", () => {
  const name = "name";
  it("should work", () => {
    const actualResult = getType({ name: "name", type: "string" });
    const expectedResult = "name:string";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle string type without length", () => {
    const type = "string";
    const length = undefined;
    const precision = undefined;
    const scale = undefined;
    const actualResult = getType({ name, type, length, precision, scale });
    const expectedResult = "name:string";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle string type with length", () => {
    const type = "string";
    const length = 255;
    const precision = undefined;
    const scale = undefined;
    const actualResult = getType({ name, type, length, precision, scale });
    const expectedResult = "name:string(255)";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle integer type", () => {
    const type = "integer";
    const length = undefined;
    const precision = undefined;
    const scale = undefined;
    const actualResult = getType({ name, type, length, precision, scale });
    const expectedResult = "name:integer";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle decimal type with precision and scale", () => {
    const type = "decimal";
    const length = undefined;
    const precision = 10;
    const scale = 2;
    const actualResult = getType({ name, type, length, precision, scale });
    const expectedResult = "name:decimal(10,2)";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle boolean type", () => {
    const type = "boolean";
    const length = undefined;
    const precision = undefined;
    const scale = undefined;
    const actualResult = getType({ name, type, length, precision, scale });
    const expectedResult = "name:boolean";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle date type", () => {
    const type = "date";
    const length = undefined;
    const precision = undefined;
    const scale = undefined;
    const actualResult = getType({ name, type, length, precision, scale });
    const expectedResult = "name:date";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle timestamp type", () => {
    const type = "timestamp";
    const length = undefined;
    const precision = undefined;
    const scale = undefined;
    const actualResult = getType({ name, type, length, precision, scale });
    const expectedResult = "name:timestamp";
    expect(actualResult).toBe(expectedResult);
  });
});
