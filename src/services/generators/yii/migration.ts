import type { MigrationCmdYiiGenerate } from "@models/services/generators";
import { fieldsGenerate } from "./fieldsGenerate";

export const migrationCmdYiiGenerate: MigrationCmdYiiGenerate = (
  name,
  attributes,
  hideId = true,
) => {
  const tableName = name.toLowerCase();
  const filteredAttributes = hideId
    ? attributes.filter((attr) => !attr.isPrimaryKey || attr.name !== "id")
    : attributes;
  const fieldsString = fieldsGenerate(filteredAttributes);
  return `php yii migrate/create create_${tableName}_table --fields="${fieldsString}"`;
};
