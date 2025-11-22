import type { MigrationCmdYiiGenerate } from "@models/services/generators";
import { fieldsGenerate } from "./fieldsGenerate";

export const migrationCmdYiiGenerate: MigrationCmdYiiGenerate = (
  name,
  attributes,
  hideId = true,
  isJunction = false,
  junctionTable1Name = "",
  junctionTable2Name = "",
) => {
  const tableName = name.toLowerCase();

  // If it's a junction table, generate the junction table command
  if (isJunction && junctionTable1Name && junctionTable2Name) {
    const table1 = junctionTable1Name.toLowerCase();
    const table2 = junctionTable2Name.toLowerCase();
    const filteredAttributes = attributes
      .filter((attr) => !attr.isPrimaryKey && !attr.isForeignKey)
      .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
    const fieldsString = filteredAttributes.length > 0
      ? fieldsGenerate(filteredAttributes)
      : "";

    return `php yii migrate/create create_junction_table_for_${table1}_and_${table2}_tables${fieldsString ? ` --fields="${fieldsString}"` : ""}`;
  }

  // Regular table command
  const filteredAttributes = (hideId
    ? attributes.filter((attr) => !attr.isPrimaryKey || attr.name !== "id")
    : attributes)
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
  const fieldsString = fieldsGenerate(filteredAttributes);
  return `php yii migrate/create create_${tableName}_table --fields="${fieldsString}"`;
};
