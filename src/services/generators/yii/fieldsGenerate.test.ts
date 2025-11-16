import { fieldsGenerate } from "./fieldsGenerate";
import { describe, expect, it } from "vitest";

describe("fieldsGenerate", () => {
  it("should return empty string for empty array", () => {
    const actualResult = fieldsGenerate([]);
    const expectedResult = "";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle single simple attribute", () => {
    const actualResult = fieldsGenerate([
      { name: "username", type: "string", length: 50 },
    ]);
    const expectedResult = "username:string(50)";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle multiple simple attributes", () => {
    const actualResult = fieldsGenerate([
      { name: "username", type: "string", length: 50 },
      { name: "age", type: "integer" },
      { name: "active", type: "boolean" },
    ]);
    const expectedResult = "username:string(50),age:integer,active:boolean";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle attribute with isNotNull", () => {
    const actualResult = fieldsGenerate([
      { name: "email", type: "string", length: 100, isNotNull: true },
    ]);
    const expectedResult = "email:string(100):notNull";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle attribute with isPrimaryKey", () => {
    const actualResult = fieldsGenerate([
      { name: "id", type: "integer", isPrimaryKey: true },
    ]);
    const expectedResult = "id:integer:primaryKey";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle attribute with isUnique", () => {
    const actualResult = fieldsGenerate([
      { name: "username", type: "string", length: 50, isUnique: true },
    ]);
    const expectedResult = "username:string(50):unique";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle attribute with isUnsigned", () => {
    const actualResult = fieldsGenerate([
      { name: "count", type: "integer", isUnsigned: true },
    ]);
    const expectedResult = "count:integer:unsigned";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle attribute with defaultValue string", () => {
    const actualResult = fieldsGenerate([
      { name: "status", type: "string", length: 20, defaultValue: "active" },
    ]);
    const expectedResult = "status:string(20):defaultValue(active)";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle attribute with defaultValue number", () => {
    const actualResult = fieldsGenerate([
      { name: "views", type: "integer", defaultValue: 0 },
    ]);
    const expectedResult = "views:integer:defaultValue(0)";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle attribute with foreignKey", () => {
    const actualResult = fieldsGenerate([
      {
        name: "user_id",
        type: "integer",
        isForeignKey: true,
        referencesTable: "users",
        referencesField: "id",
      },
    ]);
    const expectedResult = "user_id:integer:foreignKey(users)";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle attribute with multiple modifiers", () => {
    const actualResult = fieldsGenerate([
      {
        name: "email",
        type: "string",
        length: 255,
        isNotNull: true,
        isUnique: true,
      },
    ]);
    const expectedResult = "email:string(255):notNull:unique";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle complex example with all field types", () => {
    const actualResult = fieldsGenerate([
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "username", type: "string", length: 50, isNotNull: true, isUnique: true },
      { name: "email", type: "string", length: 100, isNotNull: true },
      { name: "age", type: "integer", isUnsigned: true },
      { name: "status", type: "string", length: 20, defaultValue: "pending" },
      {
        name: "role_id",
        type: "integer",
        isForeignKey: true,
        referencesTable: "roles",
        referencesField: "id",
      },
    ]);
    const expectedResult =
      "id:integer:primaryKey,username:string(50):notNull:unique,email:string(100):notNull,age:integer:unsigned,status:string(20):defaultValue(pending),role_id:integer:foreignKey(roles)";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle decimal type with precision and scale", () => {
    const actualResult = fieldsGenerate([
      { name: "price", type: "decimal", precision: 10, scale: 2, isNotNull: true },
      { name: "tax", type: "decimal", precision: 5, scale: 2 },
    ]);
    const expectedResult = "price:decimal(10,2):notNull,tax:decimal(5,2)";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle timestamp behavior fields", () => {
    const actualResult = fieldsGenerate([
      { name: "created_at", type: "integer", isNotNull: true, isUnsigned: true },
      { name: "updated_at", type: "integer", isNotNull: true, isUnsigned: true },
    ]);
    const expectedResult =
      "created_at:integer:notNull:unsigned,updated_at:integer:notNull:unsigned";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle blameable behavior fields", () => {
    const actualResult = fieldsGenerate([
      { name: "created_by", type: "integer", isNotNull: true, isUnsigned: true },
      { name: "updated_by", type: "integer", isNotNull: true, isUnsigned: true },
    ]);
    const expectedResult =
      "created_by:integer:notNull:unsigned,updated_by:integer:notNull:unsigned";
    expect(actualResult).toBe(expectedResult);
  });

  it("should handle text and date types", () => {
    const actualResult = fieldsGenerate([
      { name: "description", type: "text" },
      { name: "birth_date", type: "date", isNotNull: true },
    ]);
    const expectedResult = "description:text,birth_date:date:notNull";
    expect(actualResult).toBe(expectedResult);
  });
});
