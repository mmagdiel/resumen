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

  // Countable types with length parameter
  it("should handle char type with length", () => {
    const type = "char";
    const length = 10;
    const actualResult = getType({ name, type, length });
    const expectedResult = "name:char(10)";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle binary type with length", () => {
    const type = "binary";
    const length = 64;
    const actualResult = getType({ name, type, length });
    const expectedResult = "name:binary(64)";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle tinyInteger type with length", () => {
    const type = "tinyInteger";
    const length = 3;
    const actualResult = getType({ name, type, length });
    const expectedResult = "name:tinyInteger(3)";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle smallint type with length", () => {
    const type = "smallint";
    const length = 5;
    const actualResult = getType({ name, type, length });
    const expectedResult = "name:smallint(5)";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle integer type with length", () => {
    const type = "integer";
    const length = 11;
    const actualResult = getType({ name, type, length });
    const expectedResult = "name:integer(11)";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle bigint type with length", () => {
    const type = "bigint";
    const length = 20;
    const actualResult = getType({ name, type, length });
    const expectedResult = "name:bigint(20)";
    expect(actualResult).toBe(expectedResult);
  });

  // Scatterable types with precision parameter
  it("should handle datetime type with precision", () => {
    const type = "datetime";
    const precision = 6;
    const actualResult = getType({ name, type, precision });
    const expectedResult = "name:datetime(6)";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle time type with precision", () => {
    const type = "time";
    const precision = 3;
    const actualResult = getType({ name, type, precision });
    const expectedResult = "name:time(3)";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle timestamp type with precision", () => {
    const type = "timestamp";
    const precision = 6;
    const actualResult = getType({ name, type, precision });
    const expectedResult = "name:timestamp(6)";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle float type with precision", () => {
    const type = "float";
    const precision = 8;
    const actualResult = getType({ name, type, precision });
    const expectedResult = "name:float(8)";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle double type with precision", () => {
    const type = "double";
    const precision = 16;
    const actualResult = getType({ name, type, precision });
    const expectedResult = "name:double(16)";
    expect(actualResult).toBe(expectedResult);
  });

  // Scalable types with precision and scale
  it("should handle money type with precision and scale", () => {
    const type = "money";
    const precision = 19;
    const scale = 4;
    const actualResult = getType({ name, type, precision, scale });
    const expectedResult = "name:money(19,4)";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle decimal type without precision and scale", () => {
    const type = "decimal";
    const actualResult = getType({ name, type });
    const expectedResult = "name:decimal";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle money type without precision and scale", () => {
    const type = "money";
    const actualResult = getType({ name, type });
    const expectedResult = "name:money";
    expect(actualResult).toBe(expectedResult);
  });

  // Lackable types should ignore all parameters
  it("should handle text type and ignore length parameter", () => {
    const type = "text";
    const length = 100; // should be ignored
    const actualResult = getType({ name, type, length });
    const expectedResult = "name:text";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle json type and ignore precision parameter", () => {
    const type = "json";
    const precision = 10; // should be ignored
    const actualResult = getType({ name, type, precision });
    const expectedResult = "name:json";
    expect(actualResult).toBe(expectedResult);
  });
});
