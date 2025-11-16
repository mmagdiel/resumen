import type { FieldsGenerate } from "@models/services/generators";
import { getType, getNotNull, getPrimaryKey } from "./fields";
import { getUnique, getForeignKey } from "./fields";
import { getDefaultValue, getUnsigned } from "./fields";

export const fieldsGenerate: FieldsGenerate = (attributes) => {
  return attributes
    .map((attr) => {
      const type = getType(attr);
      const notNull = getNotNull(attr);
      const primaryKey = getPrimaryKey(attr);
      const unique = getUnique(attr);
      const unsigned = getUnsigned(attr);
      const defaultValue = getDefaultValue(attr);
      const foreignKey = getForeignKey(attr);
      return `${type}${notNull}${primaryKey}${unique}${unsigned}${defaultValue}${foreignKey}`;
    })
    .join(",");
};
