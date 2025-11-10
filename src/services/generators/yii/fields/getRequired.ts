import type { GetRequired } from "@/models";

export const getRequired: GetRequired = (attr) => {
  const { isRequired } = attr;
  return isRequired ? `:notNull` : ``;
};
