import type { Database, Table, Attribute } from "@models/core/yii";

export interface UseSchema {
  schema: Database;
  addTable: (table: Omit<Table, "id" | "position">) => void;
  updateTable: (id: string, data: Partial<Omit<Table, "id">>) => void;
  deleteTable: (id: string) => void;
  updateTablePosition: (id: string, position: { x: number; y: number }) => void;
  addAttribute: (tableId: string, attribute: Omit<Attribute, "id">) => void;
  updateAttribute: (
    tableId: string,
    attributeId: string,
    data: Partial<Omit<Attribute, "id">>,
  ) => void;
  deleteAttribute: (tableId: string, attributeId: string) => void;
}
