import type { Attribute } from "@models/core/yii";

export type FieldsGenerate = (attributes: Attribute[]) => string;
export type MigrationCmdYiiGenerate = (
  name: string,
  attributes: Attribute[],
) => string;
