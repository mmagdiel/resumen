import type { GetUnique } from "@/models";

export const getUnique: GetUnique = (attr) => {
  const { isUnique } = attr;
  return isUnique ? `:unique` : ``;
};
