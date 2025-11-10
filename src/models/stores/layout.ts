import type { ChangeEvent } from "react";
import type { Drawer } from "@models/stores/drawer";

type Theme = "light" | "dark";

export interface UseLayout {
  selectedTheme: Theme;
  toggleTheme: () => void;

  isModalOpen: boolean;
  handleModalOpen: () => void;
  handleModalClose: () => void;

  selectedTable: string;
  setTable: (e: ChangeEvent<HTMLSelectElement>) => void;

  drawer: Drawer;
  openDrawer: (
    type: "create" | "edit",
    tableId?: string | null,
    attributeId?: string | null,
  ) => void;
  closeDrawer: () => void;
}
