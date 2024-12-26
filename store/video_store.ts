import { create } from "zustand";
import { persist } from "zustand/middleware";
import { updateUrlParams, getUrlParam } from "@/lib/urlUtils";

interface VideoStore {
  currentVideoUrl: string;
  setVideoUrl: (url: string) => void;

  checkVideoPlay: boolean;
  setChackVideoDone: () => void

  isVideoVisible: boolean;
  toggleVideoVisibility: () => void;

  volume: number;
  setVolume: (volume: number) => void;

  isPlaying: boolean;
  togglePlayPause: () => void;

  // progress: number; // 当前播放进度
  // duration: number; // 视频总时长
  // setProgress: (progress: number) => void; // 更新播放进度
  // setDuration: (duration: number) => void; // 设置视频总时长
  
  cleanVideo: () => void;

  loadVideoFromUrl: () => void; // 从 URL 或 localStorage 加载状态
  syncToUrl: () => void; // 同步状态到 URL
}

export const useVideoStore = create<VideoStore>()(
  persist(
    (set, get) => ({
      currentVideoUrl: "",
      setVideoUrl: (url) => {
        set({ currentVideoUrl: url });
        get().syncToUrl();
      },

      checkVideoPlay: false,
      setChackVideoDone: () => {
        set({ checkVideoPlay: true });
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

      // progress: 0,
      // duration: 0,
      // setProgress: (progress) => {
      //   set({ progress });
      // },
      // setDuration: (duration) => set({ duration }),

      cleanVideo: () => {
        set(() => ({
          currentVideoUrl: '',
        }));
      },

      // 从 URL 或 localStorage 加载状态
      loadVideoFromUrl: () => {
        const videoParam = getUrlParam("video");
        if (videoParam) {
          // 如果 URL 中有视频参数，从 URL 加载状态
          const [url, isPlaying, isVisible, volume] = videoParam.split(",");
          set({
            currentVideoUrl: url || "",
            isPlaying: isPlaying === "true",
            isVideoVisible: isVisible === "true",
            volume: volume ? parseInt(volume, 10) : 100,
            checkVideoPlay: true
          });
        } else {
          // 如果 URL 中没有视频参数，从 localStorage 恢复状态
          const { currentVideoUrl, isPlaying, isVideoVisible, volume } = get();
          if (currentVideoUrl) {
            set({ checkVideoPlay: true });
            updateUrlParams({
              video: [
                currentVideoUrl,
                isPlaying,
                isVideoVisible,
                volume,
              ].join(","),
            });
          }
        }
      },

      // 同步状态到 URL
      syncToUrl: () => {
        const { currentVideoUrl, isPlaying, isVideoVisible, volume } = get();
        if (!currentVideoUrl) {
          updateUrlParams({ video: null });
        } else {
          const videoParam = [
            currentVideoUrl,
            isPlaying,
            isVideoVisible,
            volume,
          ].join(",");
          updateUrlParams({ video: videoParam });
        }
      },
    }),
    {
      name: "video-store", // localStorage 的 key
      partialize: (state) =>
        // 仅存储以下状态
        ({
          currentVideoUrl: state.currentVideoUrl,
          isVideoVisible: state.isVideoVisible,
          volume: state.volume,
          isPlaying: state.isPlaying,
        }),
    }
  )
);
