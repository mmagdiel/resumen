import { expect, it, describe } from "vitest";
import { migrationCmdYiiGenerate } from "./migration.ts";

describe("migrationCmdYiiGenerate", () => {
  it("add migrate without attributes", () => {
    const actualResult = migrationCmdYiiGenerate("hola", []);
    const expectedResult = 'yii migrate/create create_hola_table --fields=""';
    expect(actualResult).toBe(expectedResult);
  });

  it("add migrate without attributes", () => {
    const actualResult = migrationCmdYiiGenerate("hola", []);
    const expectedResult = 'yii migrate/create create_hola_table --fields=""';
    expect(actualResult).toBe(expectedResult);
  });

  it("add migrate with single attribute", () => {
    const actualResult = migrationCmdYiiGenerate("users", [
      { name: "username", type: "string", length: 255 },
    ]);
    const expectedResult =
      'yii migrate/create create_users_table --fields="username:string(255)"';
    expect(actualResult).toBe(expectedResult);
  });

  it("add migrate with multiple attributes", () => {
    const actualResult = migrationCmdYiiGenerate("products", [
      { name: "name", type: "string", length: 100 },
      { name: "price", type: "decimal", precision: 10, scale: 2 },
      { name: "quantity", type: "integer" },
    ]);
    const expectedResult =
      'yii migrate/create create_products_table --fields="name:string(100),price:decimal(10,2),quantity:integer"';
    expect(actualResult).toBe(expectedResult);
  });

  it("add migrate with required fields", () => {
    const actualResult = migrationCmdYiiGenerate("employees", [
      { name: "email", type: "string", length: 255, isNotNull: true },
      { name: "hire_date", type: "date", isNotNull: true },
    ]);
    const expectedResult =
      'yii migrate/create create_employees_table --fields="email:string(255):notNull,hire_date:date:notNull"';
    expect(actualResult).toBe(expectedResult);
  });

  it("add migrate with default values", () => {
    const actualResult = migrationCmdYiiGenerate("posts", [
      { name: "status", type: "string", length: 20, defaultValue: "draft" },
      { name: "views", type: "integer", defaultValue: 0 },
    ]);
    const expectedResult =
      'yii migrate/create create_posts_table --fields="status:string(20):defaultValue(draft),views:integer:defaultValue(0)"';
    expect(actualResult).toBe(expectedResult);
  });

  it("should hide id field when hideId is true (default)", () => {
    const actualResult = migrationCmdYiiGenerate("users", [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "username", type: "string", length: 50 },
    ]);
    const expectedResult =
      'yii migrate/create create_users_table --fields="username:string(50)"';
    expect(actualResult).toBe(expectedResult);
  });

  it("should show id field when hideId is false", () => {
    const actualResult = migrationCmdYiiGenerate(
      "users",
      [
        { name: "id", type: "integer", isPrimaryKey: true },
        { name: "username", type: "string", length: 50 },
      ],
      false,
    );
    const expectedResult =
      'yii migrate/create create_users_table --fields="id:primaryKey,username:string(50)"';
    expect(actualResult).toBe(expectedResult);
  });

  it("should hide id field but keep other primary keys when hideId is true", () => {
    const actualResult = migrationCmdYiiGenerate("posts", [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "uuid", type: "string", length: 36, isPrimaryKey: true },
      { name: "title", type: "string", length: 100 },
    ]);
    const expectedResult =
      'yii migrate/create create_posts_table --fields="uuid:bigPrimaryKey,title:string(100)"';
    expect(actualResult).toBe(expectedResult);
  });
});
