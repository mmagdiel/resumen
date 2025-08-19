import { create } from "zustand";

import { handleModal, toggleTheme } from "@stores/actions";

import type { UseLayout } from "@models/stores";

const initialDrawer = {
  type: null,
  isOpen: false,
  tableId: null,
  attributeId: null,
};

export type OpenDrawer = (
  type: "create" | "edit",
  tableId: string | null,
  attributeId: string | null,
) => Partial<UseLayout>;

const openDrawer: OpenDrawer = (type, tableId, attributeId) => ({
  drawer: {
    isOpen: true,
    type,
    tableId,
    attributeId,
  },
});

export const useLayout = create<UseLayout>((set) => ({
  selectedTable: "",
  setTable: (e) => set({ selectedTable: e.target.value }),

  selectedTheme: "light",
  toggleTheme: () => set(toggleTheme),

  isModalOpen: false,
  handleModalOpen: () => set(handleModal(true)),
  handleModalClose: () => set(handleModal(false)),

  drawer: initialDrawer,
  openDrawer: (type, tableId = null, attributeId = null) =>
    set(openDrawer(type, tableId, attributeId)),
  closeDrawer: () =>
    set(() => ({
      drawer: {
        isOpen: false,
        type: null,
        tableId: null,
        attributeId: null,
      },
    })),
}));
