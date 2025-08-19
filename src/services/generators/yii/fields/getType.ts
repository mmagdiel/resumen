import type { GetType } from "@/models";

export const getType: GetType = (attr) => {
  const { name, type, precision, scale, length } = attr;
  return type === "decimal" && precision && scale
    ? `${name}:${type}(${precision},${scale})`
    : type === "string" && length
    ? `${name}:${type}(${length})`
    : `${name}:${type}`;
};
