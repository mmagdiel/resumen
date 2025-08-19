export const ScalableAttrTypes = ["decimal", "money"] as const;
export type ScalableAttrType = (typeof ScalableAttrTypes)[number];
