import { create } from "zustand";
import { updateUrlParams, getUrlParam } from "@/lib/urlUtils";

interface BackgroundState {
  currentBackground: string;
  setBackground: (bgName: string) => void;
  loadBgFromUrl: () => void;
}

const defaultBg = 'rain-street'

export const useBackgroundStore = create<BackgroundState>((set) => ({
  currentBackground: `/bgs/white-noise.gif`, // 默认背景

  setBackground: (bgName: string) => {
    const bgSrc = `/bgs/${bgName}.gif`
    set({ currentBackground: bgSrc });
    updateUrlParams({ background: bgName });
  },

  loadBgFromUrl: () => {
    const bgName = getUrlParam("background");
    if (bgName) {
      set({ currentBackground: `/bgs/${bgName}.gif` });
      updateUrlParams({ background: bgName });
    } else {
      set({ currentBackground: `/bgs/${defaultBg}.gif` });
      updateUrlParams({ background: defaultBg });
    }
  },
}));
