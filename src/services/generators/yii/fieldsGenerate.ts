import type { FieldsGenerate } from "@models/services/generators";
import { getType, getRequired, getPrimaryKey } from "./fields";
import { getUnique, getForeignKey, getDefaultValue } from "./fields";

export const fieldsGenerate: FieldsGenerate = (attributes) => {
  return attributes
    .map((attr) => {
      const type = getType(attr);
      const required = getRequired(attr);
      const primaryKey = getPrimaryKey(attr);
      const unique = getUnique(attr);
      const defaultValue = getDefaultValue(attr);
      const foreignKey = getForeignKey(attr);
      return `${type}${required}${primaryKey}${unique}${defaultValue}${foreignKey}`;
    })
    .join(",");
};
