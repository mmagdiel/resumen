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
      { name: "email", type: "string", length: 255, isRequired: true },
      { name: "hire_date", type: "date", isRequired: true },
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
});
