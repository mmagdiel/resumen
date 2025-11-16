import type { GetType } from "@/models";
import { getPrimaryKey } from "./getPrimaryKey";

export const getType: GetType = (attr) => {
  const { name, isPrimaryKey, type, precision, scale, length } = attr;
  if (isPrimaryKey) return getPrimaryKey(attr);
  return type === "decimal" && precision && scale
    ? `${name}:${type}(${precision},${scale})`
    : type === "string" && length
      ? `${name}:${type}(${length})`
      : `${name}:${type}`;
};
