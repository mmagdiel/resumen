import type { CountableAttrType, ScatterableAttrType } from "./types";
import type { LackableAttrType, ScalableAttrType } from "./types";

interface AttrDTO {
  id?: string;
  name: string;
  sort?: number;
  isNotNull?: boolean;
  isUnique?: boolean;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  isUnsigned?: boolean;
  referencesTable?: string;
  referencesField?: string;
  defaultValue?: string | number | null;
}

interface NeverAttrs {
  scale?: never;
  length?: never;
  precision?: never;
}

export interface LackAttrs extends AttrDTO, NeverAttrs {
  type: LackableAttrType;
}

export interface CountAttrs extends AttrDTO, Omit<NeverAttrs, "length"> {
  type: CountableAttrType;
  length?: number;
}

export interface ScatterableAttrs
  extends AttrDTO,
    Omit<NeverAttrs, "precision"> {
  type: ScatterableAttrType;
  precision?: number;
}

export interface ScaleAttrs
  extends AttrDTO,
    Omit<NeverAttrs, "precision" | "scale"> {
  type: ScalableAttrType;
  scale?: number;
  precision?: number;
}

export type Attribute = LackAttrs | CountAttrs | ScatterableAttrs | ScaleAttrs;
