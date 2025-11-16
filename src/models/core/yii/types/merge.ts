import { LackableAttrTypes } from "./lackable";
import { ScalableAttrTypes } from "./scalable";
import { CountableAttrTypes } from "./countable";
import { ScatterableAttrTypes } from "./scatterable";

const countable = [...LackableAttrTypes, ...CountableAttrTypes];
const uncountable = [...ScatterableAttrTypes, ...ScalableAttrTypes];

export const AttributeTypes = [...countable, ...uncountable] as const;
export type AttributeType = (typeof AttributeTypes)[number];
