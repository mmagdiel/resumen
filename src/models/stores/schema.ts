import type { Database, Node, Attribute } from "@models/core/yii";

export interface UseSchema {
  schema: Database;
  setDiagramName: (name: string) => void;
  addNode: (node: Omit<Node, "id" | "position">) => void;
  updateNode: (id: string, data: Partial<Omit<Node, "id">>) => void;
  deleteNode: (id: string) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  addAttribute: (tableId: string, attribute: Omit<Attribute, "id">) => void;
  updateAttribute: (
    tableId: string,
    attributeId: string,
    data: Partial<Omit<Attribute, "id">>,
  ) => void;
  deleteAttribute: (tableId: string, attributeId: string) => void;
}
