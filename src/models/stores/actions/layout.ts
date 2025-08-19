import type { UseLayout } from "@models/stores";

export type HandleModal = (is: boolean) => Partial<UseLayout>;
export type ToggleTheme = (state: Partial<UseLayout>) => Partial<UseLayout>;
