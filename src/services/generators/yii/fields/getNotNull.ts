import type { GetNotNull } from "@/models";

export const getNotNull: GetNotNull = (attr) => {
  const { isNotNull } = attr;
  return isNotNull ? `:notNull` : ``;
};
