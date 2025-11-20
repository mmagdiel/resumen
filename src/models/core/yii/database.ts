import type { Attribute } from "./attributes";

export type Attributes = Attribute[];

export interface Position {
  x: number;
  y: number;
}

export interface Node {
  id: string;
  name: string;
  position: Position;
  description: string;
  withTimestamps?: boolean;
  withBlameable?: boolean;
  hideIdInCommand?: boolean;
  isJunction?: boolean;
  junctionTable1?: string;
  junctionTable2?: string;
  attributes: Attributes;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
  sourceHandle?: string;
  targetHandle?: string;
}

type Nodes = Node[];
type Edges = Edge[];

export interface Database {
  name: string;
  nodes: Nodes;
  edges: Edges;
}

export type AttrFormValues = Omit<Attribute, "id">;
export type NodeFormValues = Omit<Node, "id" | "position">;
