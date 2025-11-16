export const LackableAttrTypes = ["text", "date", "json", "boolean"] as const;
export type LackableAttrType = (typeof LackableAttrTypes)[number];
