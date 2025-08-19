import type { AttributeType } from "./types";

export interface AttrDTO {
  id?: string;
  name: string;
  type: AttributeType;
  isRequired?: boolean;
  isUnique?: boolean;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  referencesTable?: string;
  referencesField?: string;
  defaultValue?: string | number | null;
}

export interface NeverAttrs {
  length?: never;
  precision?: never;
  scale?: never;
}

export interface FlatAttrs extends AttrDTO {
  length?: never;
  precision?: never;
  scale?: never;
}

export interface CountAttrs extends AttrDTO, Omit<NeverAttrs, "length"> {
  length: number;
}

export interface AccuracyAttrs extends AttrDTO, Omit<NeverAttrs, "precision"> {
  precision: number;
}

export interface ScaleAttrs
  extends AttrDTO,
    Omit<NeverAttrs, "precision" | "scale"> {
  scale: number;
  precision: number;
}

export type Attribute = FlatAttrs | CountAttrs | AccuracyAttrs | ScaleAttrs;
