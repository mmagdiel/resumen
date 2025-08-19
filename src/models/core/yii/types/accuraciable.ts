const dates = ["datetime", "time", "timestamp"];

export const AccuraciableAttrTypes = [...dates, "float"] as const;
export type AccuraciableAttrType = (typeof AccuraciableAttrTypes)[number];
