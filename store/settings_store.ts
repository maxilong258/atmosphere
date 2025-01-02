// src/store/sheet_store.ts
import { create } from "zustand";

interface SettingsSheetState {
  isSheetOpen: boolean;
  isInited: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  setInitDone: () => void;
}

export const useSettingsStore = create<SettingsSheetState>((set) => ({
  isSheetOpen: false,
  isInited: false,
  openSheet: () => set({ isSheetOpen: true }),
  closeSheet: () => set({ isSheetOpen: false }),
  setInitDone: () => set({isInited: true})
}));
