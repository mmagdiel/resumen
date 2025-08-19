import type { Attribute } from "@models/core/yii";

export type Attributes = Attribute[];

export type FieldsGenerate = (attributes: Attributes) => string;
export type MigrationCmdYiiGenerate = (
  name: string,
  attributes: Attributes,
) => string;
