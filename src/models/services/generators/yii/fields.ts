import type { Attribute } from "@models/core/yii";

export type GetUnique = (attr: Attribute) => string;
export type GetType = (attr: Attribute) => string;
export type GetRequired = (attr: Attribute) => string;
export type GetPrimaryKey = (attr: Attribute) => string;
export type GetForeignKey = (attr: Attribute) => string;
export type GetDefaultValue = (attr: Attribute) => string;
export type GetUnsigned = (attr: Attribute) => string;
