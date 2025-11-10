import type { MigrationCmdYiiGenerate } from "@models/services/generators";
import { fieldsGenerate } from "./fieldsGenerate";

export const migrationCmdYiiGenerate: MigrationCmdYiiGenerate = (
  name,
  attributes,
) => {
  const tableName = name.toLowerCase();
  const fieldsString = fieldsGenerate(attributes);
  return `yii migrate/create create_${tableName}_table --fields="${fieldsString}"`;
};
