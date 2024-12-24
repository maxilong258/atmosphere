import { create } from "zustand";
import { updateUrlParams, getUrlParam } from "@/lib/urlUtils";

interface BackgroundState {
  currentBackground: string;
  setBackground: (bgName: string) => void;
  loadBgFromUrl: () => void;
}

export const useBackgroundStore = create<BackgroundState>((set) => ({
  currentBackground: "/bgs/rain-street.gif", // 默认背景

  setBackground: (bgName: string) => {
    const bgSrc = `/bgs/${bgName}.gif`
    set({ currentBackground: bgSrc });
    updateUrlParams({ background: bgName });
  },

  loadBgFromUrl: () => {
    const bgName = getUrlParam("background");
    const bgSrc = `/bgs/${bgName}.gif`
    if (bgName) {
      set({ currentBackground: bgSrc });
    }
  },
}));
