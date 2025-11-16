import type { GetPrimaryKey } from "@/models";

export const getPrimaryKey: GetPrimaryKey = (attr) => {
  const { type, name } = attr;
  return type === "integer" ? `${name}:primaryKey` : `${name}:bigPrimaryKey`;
};
