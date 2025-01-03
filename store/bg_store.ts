import { create } from "zustand";
import { persist } from "zustand/middleware";
import { updateUrlParams, getUrlParam } from "@/lib/urlUtils";

interface BackgroundState {
  currentBackground: string | null;
  setBackground: (bgName: string) => void;
  loadBgFromUrl: () => void;
}

const defaultBg = "my-window";

export const useBackgroundStore = create<BackgroundState>()(
  // persist(
    (set, get) => ({
      currentBackground: null,
      setBackground: (bgName: string) => {
        const bgSrc = `/bgs/${bgName}.gif`;
        set({ currentBackground: bgSrc });
        updateUrlParams({ background: bgName });
      },

      loadBgFromUrl: () => {
        const bgName = getUrlParam("background");
        const storedbg = get().currentBackground;
        if (bgName) {
          set({ currentBackground: `/bgs/${bgName}.gif` });
          updateUrlParams({ background: bgName });
        } else if (storedbg) {
          // const bgNameFromStorage = storedbg.split("/").pop()?.replace(".gif", "");
          // updateUrlParams({ background: bgNameFromStorage || defaultBg });
        } else {
          set({ currentBackground: `/bgs/${defaultBg}.gif` });
          updateUrlParams({ background: defaultBg });
        }
      },
    }),
  //   {
  //     name: "background-store",
  //     partialize: (state) => ({ currentBackground: state.currentBackground }), // 只存储当前背景
  //   }
  // )
);

