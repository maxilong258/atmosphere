import { create } from "zustand";
import { persist } from "zustand/middleware";
import { updateUrlParams, getUrlParam } from "@/lib/urlUtils";

interface Audio {
  isPlaying: boolean;
  volume: number;
  audioRef: HTMLAudioElement | null;
  soundName: string | null;
  timeUpdateListener: any;
}

interface AudioState {
  audios: Record<string, Audio>; // 以 soundUrl 为键，存储多个音频的状态
  toggleAudio: (soundUrl: string, toggleToClose?: boolean) => void;
  setVolume: (soundUrl: string, newVolume: number) => void;
  cleanAudios: () => void;
  loadAudioFromUrl: () => void;
}

function extractFileName(input: string) {
  const match = input.match(/\/sounds\/(.*?)\.mp3/);
  return match ? match[1] : null; // match[1] 是中间的部分
}

export const getPlayingAudios = (audios: Record<string, Audio>) => {
  return Object.entries(audios)
  .filter(([, audio]) => audio.isPlaying)
  .map(([url, audio]) => `${extractFileName(url)},${audio.volume}`)
  .join(";");
} 

export const useAudioStore = create<AudioState>()(
  // persist(
    (set, get) => ({
      audios: {},

      toggleAudio: (soundUrl: string, toggleToClose?: boolean) => {
        const { audios } = get();
        const currentAudio = audios[soundUrl];
        const soundName = extractFileName(soundUrl);

        if (currentAudio?.isPlaying) {
          // 如果音频正在播放，暂停音频并移除监听器
          currentAudio.audioRef?.pause();
          currentAudio.audioRef?.removeEventListener("timeupdate", currentAudio.timeUpdateListener!);
          currentAudio.audioRef = null
          set((state) => ({
            audios: {
              ...state.audios,
              [soundUrl]: { ...currentAudio, isPlaying: false, timeUpdateListener: null },
            },
          }));
        } else {
          if (toggleToClose) {
            return
          }
          let audioRef = currentAudio?.audioRef;
          if (!audioRef) {
            audioRef = new Audio(soundUrl);
            audioRef.volume = currentAudio?.volume || 1;
            audioRef.loop = true;
          }

          // 创建监听器
          const timeUpdateListener = () => {
            if (audioRef.currentTime >= audioRef.duration - 1) {
              audioRef.currentTime = 0;
            }
          };

          // 添加监听器并保存到状态
          audioRef.addEventListener("timeupdate", timeUpdateListener);

          audioRef.play();

          set((state) => ({
            audios: {
              ...state.audios,
              [soundUrl]: {
                isPlaying: true,
                volume: currentAudio?.volume || 1,
                audioRef,
                timeUpdateListener, // 保存监听器引用
                soundName,
              },
            },
          }));
        }

        // 更新 URL 参数
       
        const playingAudios = getPlayingAudios(get().audios)
        if (playingAudios) {
          updateUrlParams({ sounds: playingAudios });
        } else {
          updateUrlParams({ sounds: null });
        }
      },

      setVolume: (soundUrl: string, newVolume: number) => {
        const { audios } = get();
        const currentAudio = audios[soundUrl];

        if (currentAudio?.audioRef) {
          currentAudio.audioRef.volume = newVolume;
        }

        set((state) => ({
          audios: {
            ...state.audios,
            [soundUrl]: {
              ...currentAudio,
              volume: newVolume,
            },
          },
        }));

        // 更新 URL 参数
        const playingAudios =  getPlayingAudios(get().audios)
        if (playingAudios) {
          updateUrlParams({ sounds: playingAudios });
        }
      },

      cleanAudios: () => {
        const { audios, toggleAudio } = get()
        Object.keys(audios).forEach(key => toggleAudio(key, true))
        set({
          audios: {}
        })
      },

      loadAudioFromUrl: () => {
        const soundsParam = getUrlParam("sounds");
        if (soundsParam) {
          // 如果 URL 中有参数，从 URL 加载状态
          try {
            const basePath = "/sounds/";

            const audioState = soundsParam.split(";").reduce((state, entry) => {
              const [fileName, volume] = entry.split(",");
              if (fileName && volume) {
                const soundUrl = `${basePath}${fileName}.mp3`;
                state[soundUrl] = { volume: parseFloat(volume) };
              }
              return state;
            }, {} as Record<string, { volume: number }>);

            Object.entries(audioState).forEach(([soundUrl, { volume }]) => {
              const audioRef = new Audio(soundUrl);
              audioRef.volume = volume;
              audioRef.loop = true;

              // 创建监听器
              const timeUpdateListener = () => {
                if (audioRef.currentTime >= audioRef.duration - 1) {
                  audioRef.currentTime = 0;
                }
              };

              // 添加监听器
              audioRef.addEventListener("timeupdate", timeUpdateListener);

              audioRef.play();

              const soundName = extractFileName(soundUrl);
              set((state) => ({
                audios: {
                  ...state.audios,
                  [soundUrl]: {
                    isPlaying: true,
                    volume,
                    audioRef,
                    timeUpdateListener, // 保存监听器引用
                    soundName,
                  },
                },
              }));
            });
          } catch (error) {
            console.error("Failed to load audio state from URL:", error);
          }
        } else {
          // // 如果 URL 中没有参数，从 localStorage 加载状态
          // const storedAudios = get().audios;
          
          // Object.entries(storedAudios).forEach(([soundUrl, audio]) => {
          //   if (audio.isPlaying) {
          //     const audioRef = new Audio(soundUrl);
          //     audioRef.volume = audio.volume;
          //     audioRef.loop = true;

          //     const timeUpdateListener = () => {
          //       if (audioRef.currentTime >= audioRef.duration - 1) {
          //         audioRef.currentTime = 0;
          //       }
          //     };

          //     audioRef.addEventListener("timeupdate", timeUpdateListener);

          //     audioRef.play();

          //     set((state) => ({
          //       audios: {
          //         ...state.audios,
          //         [soundUrl]: {
          //           ...audio,
          //           audioRef,
          //           timeUpdateListener,
          //         },
          //       },
          //     }));
          //   }
          // });

          // const playingAudios = getPlayingAudios(get().audios)
          // if (playingAudios) {
          //   updateUrlParams({ sounds: playingAudios });
          // }
        }
      },
    }),
  //   {
  //     name: "audio-store",
  //     partialize: (state) => ({ audios: state.audios }), // 只存储 audios 状态
  //   }
  // )
);
