import type { GetForeignKey } from "@/models";

export const getForeignKey: GetForeignKey = (attr) => {
  const { isForeignKey, referencesTable } = attr;
  return isForeignKey && referencesTable
    ? `:foreignKey(${referencesTable})`
    : ``;
};
