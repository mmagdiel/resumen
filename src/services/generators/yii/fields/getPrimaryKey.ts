import type { GetPrimaryKey } from "@/models";

export const getPrimaryKey: GetPrimaryKey = (attr) => {
  const { isPrimaryKey } = attr;
  return isPrimaryKey ? `:primaryKey` : ``;
};
