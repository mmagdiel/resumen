import type { GetDefaultValue } from "@/models";

export const getDefaultValue: GetDefaultValue = (attr) => {
  const { defaultValue } = attr;
  return typeof defaultValue === "string" || typeof defaultValue === "number"
    ? `:defaultValue(${defaultValue})`
    : ``;
};
