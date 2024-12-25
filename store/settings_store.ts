// src/store/sheet_store.ts
import { create } from "zustand";

interface SettingsSheetState {
  isSheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
}

export const useSettingsStore = create<SettingsSheetState>((set) => ({
  isSheetOpen: false,
  openSheet: () => set({ isSheetOpen: true }),
  closeSheet: () => set({ isSheetOpen: false }),
}));
