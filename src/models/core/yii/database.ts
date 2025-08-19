import type { Table } from "./tables";

export interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Database {
  tables: Table[];
  edges: Edge[];
}
