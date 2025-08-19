const chars = ["char", "string"];
const integers = ["smallint", "integer", "bigint"];

export const CountableAttrTypes = [...integers, ...chars, "binary"] as const;
export type CountableAttrType = (typeof CountableAttrTypes)[number];
