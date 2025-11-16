const chars = ["char", "string"];
const ints = ["binary", "tinyInteger", "smallint", "integer", "bigint"];
const keys = ["bigPrimaryKey", "primaryKey"];

export const CountableAttrTypes = [...ints, ...chars, ...keys] as const;
export type CountableAttrType = (typeof CountableAttrTypes)[number];
