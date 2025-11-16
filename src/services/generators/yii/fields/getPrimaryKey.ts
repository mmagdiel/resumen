import type { GetPrimaryKey } from "@/models";

export const getPrimaryKey: GetPrimaryKey = (attr) => {
  const { type, isPrimaryKey } = attr;
  return isPrimaryKey
    ? type === "integer"
      ? `:primaryKey`
      : `:bigPrimaryKey`
    : ``;
};
