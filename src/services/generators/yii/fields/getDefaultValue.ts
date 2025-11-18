import type { GetDefaultValue } from "@/models";

export const getDefaultValue: GetDefaultValue = (attr) => {
  const { defaultValue } = attr;
  const isString = typeof defaultValue === "string" && defaultValue != "";
  const isNumber = typeof defaultValue === "number" && defaultValue != 0;
  return isString || isNumber ? `:defaultValue(${defaultValue})` : ``;
};
