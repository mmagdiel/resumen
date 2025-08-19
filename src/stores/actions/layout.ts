import type { HandleModal, ToggleTheme } from "@models/stores/actions";

export const handleModal: HandleModal = (is) => ({ isCmdModalOpen: is });

export const toggleTheme: ToggleTheme = (state) => ({
  selectedTheme: state.selectedTheme === "light" ? "dark" : "light",
});
