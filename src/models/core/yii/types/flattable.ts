export const FlattableAttrTypes = ["text", "date", "boolean"] as const;
export type FlattableAttrType = (typeof FlattableAttrTypes)[number];
