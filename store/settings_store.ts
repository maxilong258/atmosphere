// src/store/sheet_store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SettingsSheetState {
  isSheetOpen: boolean;
  isInited: boolean;
  isShowLayer: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  setInitDone: () => void;
  setShowLayer: (flag: boolean) => void;
}

export const useSettingsStore = create<SettingsSheetState>()(
  persist(
    (set) => ({
      isSheetOpen: false,
      isInited: false,
      isShowLayer: true,
      openSheet: () => set({ isSheetOpen: true }),
      closeSheet: () => set({ isSheetOpen: false }),
      setInitDone: () => set({ isInited: true }),
      setShowLayer: (flag: boolean) => set({ isShowLayer: flag }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ isShowLayer: state.isShowLayer }),
    }
  )
);
