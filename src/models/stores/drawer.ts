export type Drawer = {
  isOpen: boolean;
  type: "create" | "edit" | null;
  tableId: string | null;
  attributeId: string | null;
};
