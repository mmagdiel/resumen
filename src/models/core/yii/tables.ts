import type { Attribute } from "./attributes";

export interface Position {
  x: number;
  y: number;
}

export interface Table {
  id: string;
  name: string;
  description: string;
  attributes: Attribute[];
  position: Position;
}
