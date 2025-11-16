import type { GetUnsigned } from "@/models";

export const getUnsigned: GetUnsigned = (attr) => {
  const { isUnsigned } = attr;
  return isUnsigned ? `:unsigned` : ``;
};
