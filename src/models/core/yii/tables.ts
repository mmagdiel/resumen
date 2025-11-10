import type { Attributes } from "./attributes";

export interface Position {
  x: number;
  y: number;
}

export interface Table {
  id: string;
  name: string;
  description: string;
  position: Position;
  attributes: Attributes;
}
