const dates = ["datetime", "time", "timestamp"];
const numbers = ["float", "double"];

export const ScatterableAttrTypes = [...dates, ...numbers] as const;
export type ScatterableAttrType = (typeof ScatterableAttrTypes)[number];
