import type { FieldsGenerate } from "@models/services/generators";
import type { Attribute } from "@models/core";

import { getType, getNotNull } from "./fields";
import { getUnique, getForeignKey } from "./fields";
import { getDefaultValue, getUnsigned } from "./fields";

const type = "string";
const _blank = { type, isNotNull: false, isUnique: false };

export const fieldsGenerate: FieldsGenerate = (attributes) => {
  return attributes
    .map((attr) => {
      const blank: Attribute = { ..._blank, name: attr.name };
      const newAttr = !attr.isPrimaryKey ? attr : blank;
      const type = getType(attr);
      const notNull = getNotNull(newAttr);
      const unique = getUnique(newAttr);
      const unsigned = getUnsigned(attr);
      const defaultValue = getDefaultValue(attr);
      const foreignKey = getForeignKey(attr);
      return `${type}${notNull}${unique}${unsigned}${defaultValue}${foreignKey}`;
    })
    .join(",");
};
