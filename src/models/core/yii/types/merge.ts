import { FlattableAttrTypes } from "./flattable";
import { CountableAttrTypes } from "./countable";
import { AccuraciableAttrTypes } from "./accuraciable";
import { ScalableAttrTypes } from "./scalable";

const withoutFlatable = [...FlattableAttrTypes, ...CountableAttrTypes];
const withFlatable = [...AccuraciableAttrTypes, ...ScalableAttrTypes];

export const AttributeTypes = [...withoutFlatable, ...withFlatable] as const;
export type AttributeType = (typeof AttributeTypes)[number];
