import type { GetType } from "@/models";

import { getPrimaryKey } from "./getPrimaryKey";
import { CountableAttrTypes } from "@/models";
import { ScalableAttrTypes } from "@/models";
import { ScatterableAttrTypes } from "@/models";

export const getType: GetType = (attr) => {
  const { name, isPrimaryKey, type, precision, scale, length } = attr;

  // Handle primary keys specially
  if (isPrimaryKey) return getPrimaryKey(attr);

  // Check if type is scalable (decimal, money) - needs precision and scale
  if (
    ScalableAttrTypes.includes(type as any) &&
    precision !== undefined &&
    scale !== undefined
  ) {
    return precision === 0 && scale === 0
      ? `${name}:${type}`
      : `${name}:${type}(${precision},${scale})`;
  }

  // Check if type is scatterable (datetime, time, timestamp, float, double) - needs precision only
  if (ScatterableAttrTypes.includes(type as any) && precision !== undefined) {
    return precision === 0
      ? `${name}:${type}`
      : `${name}:${type}(${precision})`;
  }

  // Check if type is countable (char, string, binary, integers) - needs length only
  if (CountableAttrTypes.includes(type as any) && length !== undefined) {
    return length === 0 ? `${name}:${type}` : `${name}:${type}(${length})`;
  }

  // Default case - no parameters
  return `${name}:${type}`;
};
