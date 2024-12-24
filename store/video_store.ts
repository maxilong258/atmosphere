import { create } from "zustand";
import { updateUrlParams, getUrlParam } from "@/lib/urlUtils";

interface VideoStore {
  currentVideoUrl: string;
  setVideoUrl: (url: string) => void;

  isVideoVisible: boolean;
  toggleVideoVisibility: () => void;

  volume: number;
  setVolume: (volume: number) => void;

  isPlaying: boolean;
  togglePlayPause: () => void;

  progress: number; // 当前播放进度
  duration: number; // 视频总时长
  setProgress: (progress: number) => void; // 更新播放进度
  setDuration: (duration: number) => void; // 设置视频总时长

  loadVideoFromUrl: () => void; // 从 URL 加载状态
  syncToUrl: () => void; // 同步状态到 URL
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  currentVideoUrl: "",
  setVideoUrl: (url) => {
    set({ currentVideoUrl: url });
    get().syncToUrl()
  },

  isVideoVisible: true,
  toggleVideoVisibility: () => {
    set((state) => ({ isVideoVisible: !state.isVideoVisible }));
    get().syncToUrl(); // 同步到 URL
  },

  volume: 100,
  setVolume: (volume) => {
    set({ volume });
    get().syncToUrl(); // 同步到 URL
  },

  isPlaying: true,
  togglePlayPause: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
    get().syncToUrl(); // 同步到 URL
  },

  progress: 0,
  duration: 0,
  setProgress: (progress) => {
    set({ progress });
  },
  setDuration: (duration) => set({ duration }),

  // 从 URL 加载状态
  loadVideoFromUrl: () => {
    const videoParam = getUrlParam("video");
    if (videoParam) {
      const [url, isPlaying, isVisible, volume] = videoParam.split(";");

      set({
        currentVideoUrl: url || "",
        isPlaying: isPlaying === "true",
        isVideoVisible: isVisible === "true",
        volume: volume ? parseInt(volume, 10) : 100,
      });
    }
  },

  // 同步状态到 URL
  syncToUrl: () => {
    const { currentVideoUrl, isPlaying, isVideoVisible, volume } = get();
    if (!currentVideoUrl) {
      // updateUrlParams({ video: null });
    } else {
      const videoParam = [
        currentVideoUrl,
        isPlaying,
        isVideoVisible,
        volume,
      ].join(";");
  
      updateUrlParams({ video: videoParam });
    }

  },
}));
