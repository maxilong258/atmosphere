"use client";

import React, { useEffect, useState } from "react";
import { getPlayingAudios, useAudioStore } from "@/store/audio_store";
import { useVideoStore } from "@/store/video_store";
import {
  Shuffle,
  // TvMinimalPlay,
  Rewind,
  FastForward,
  CircleX,
  Twitter,
  Mail,
  Github,
  Heart,
} from "lucide-react";
// import Image from "next/image";
import { SettingsSheet } from "@/components/settings_sheet";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useBackgroundStore } from "@/store/bg_store";
import TypingEffect from "../TypingEffect/typing_effect";
import { useSettingsStore } from "@/store/settings_store";
import { updateUrlParams } from "@/lib/urlUtils";
import { PLAY_LIST } from "@/config/playlist";
import FullScreenToggle from "../full_screen_toggle";
import MyTimer from "../MyTimer";
import { SaveList } from "../SaveList";
import { useSavedLinks } from "@/store/saved_link_store";

export const BottomControls = () => {
  const { audios, cleanAudios } = useAudioStore();
  const { currentVideoUrl, cleanVideo, loadVideoFromUrl } = useVideoStore();
  const { loadAudioFromUrl } = useAudioStore();
  const { loadBgFromUrl, setBackground } = useBackgroundStore();
  const { isSheetOpen, isInited, setInitDone } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(false);
  const { links } = useSavedLinks();

  const [whiteNoiseAudio, setWhiteNoiseAudio] =
    useState<HTMLAudioElement | null>(null);

  const playList = [...PLAY_LIST, ...links.map((item) => item.url)];

  const handleShuffle = () => {
    setIsLoading(true);
    handleClear();
    const randomInt = Math.floor(Math.random() * 10);
    setBackground(`loading${randomInt}`);

    setTimeout(() => {
      const randomUrl = playList[Math.floor(Math.random() * playList.length)];
      window.history.pushState({}, "", randomUrl);
      loadVideoFromUrl();
      loadAudioFromUrl();
      loadBgFromUrl();
      setIsLoading(false);
    }, 200);
  };

  const onPlayListItem = (url: string) => {
    setIsLoading(true);
    handleClear();
    const randomInt = Math.floor(Math.random() * 10);
    setBackground(`loading${randomInt}`);
    if (whiteNoiseAudio) {
      whiteNoiseAudio!.currentTime = 0;
      whiteNoiseAudio!.play().then(() => {
        setTimeout(() => {
          whiteNoiseAudio!.pause();
        }, 200);
      });
    }
    setTimeout(() => {
      window.history.pushState({}, "", url);
      loadVideoFromUrl();
      loadAudioFromUrl();
      loadBgFromUrl();
      setIsLoading(false);
    }, 200);
  };

  const handleClear = () => {
    updateUrlParams({ sounds: null });
    cleanAudios();
    updateUrlParams({ video: null });
    cleanVideo();
  };

  const handlePrev = () => {
    setIsLoading(true);
    const searchStr = window.location.search;
    handleClear();
    const randomInt = Math.floor(Math.random() * 10);
    setBackground(`loading${randomInt}`);
    if (whiteNoiseAudio) {
      whiteNoiseAudio!.currentTime = 0;
      whiteNoiseAudio!.play().then(() => {
        setTimeout(() => {
          whiteNoiseAudio!.pause();
        }, 200);
      });
    }
    setTimeout(() => {
      const index = playList.findIndex((item) => item === searchStr);
      if (index > 0 && index < playList.length) {
        window.history.pushState({}, "", playList[index - 1]);
      } else {
        window.history.pushState({}, "", playList[playList.length - 1]);
      }
      loadVideoFromUrl();
      loadAudioFromUrl();
      loadBgFromUrl();
      setIsLoading(false);
    }, 200);
  };

  const handleNext = () => {
    setIsLoading(true);
    const searchStr = window.location.search;
    handleClear();
    const randomInt = Math.floor(Math.random() * 10);
    setBackground(`loading${randomInt}`);
    if (whiteNoiseAudio) {
      whiteNoiseAudio!.currentTime = 0;
      whiteNoiseAudio!.play().then(() => {
        setTimeout(() => {
          whiteNoiseAudio!.pause();
        }, 200);
      });
    }
    setTimeout(() => {
      const index = playList.findIndex((item) => item === searchStr);
      if (index >= 0 && index < playList.length - 1) {
        window.history.pushState({}, "", playList[index + 1]);
      } else {
        window.history.pushState({}, "", playList[0]);
      }
      loadVideoFromUrl();
      loadAudioFromUrl();
      loadBgFromUrl();
      setIsLoading(false);
    }, 200);
  };

  useEffect(() => {
    // 确保在客户端才加载 Audio
    if (typeof window !== "undefined") {
      const audio = new Audio("/sounds/aaa-white-noise.mp3");
      audio.preload = "auto";
      audio.volume = 0.12;
      setWhiteNoiseAudio(audio);
    }

    loadBgFromUrl();
    const handleInteraction = () => {
      if (!isInited) {
        const params = new URLSearchParams(window.location.search);
        const soundsParam =
          params.get("sounds") ||
          Object.keys(getPlayingAudios(audios)).length !== 0;
        const videoParam = params.get("video") || currentVideoUrl;
        if (videoParam || soundsParam) {
          loadAudioFromUrl();
          loadVideoFromUrl();
        } else {
          handleShuffle();
        }
        setInitDone();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isInited) {
        handleInteraction();
      } else {
        if (!isSheetOpen) {
          // 左箭头触发 handlePrev，右箭头触发 handleNext
          if (event.key === "ArrowLeft") {
            handlePrev();
          } else if (event.key === "ArrowRight") {
            handleNext();
          }
        }
      }
    };

    const handleClick = () => {
      handleInteraction();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
    };
  }, [isInited, isSheetOpen]);

  const handleMailClick = () => {
    const email = "adc3080027554@gmail.com";
    const subject = "[Feedback for My Ambience]";
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="z-40 absolute bottom-0 ">
      {!isInited ? (
        <div className="m-6 mb-20">
          <TypingEffect text="Press any key to start" />
        </div>
      ) : (
        <>
          <div className="flex justify-between w-screen">
            <div className="flex m-10 mb-12 space-x-1">
              <Button
                disabled={isLoading}
                variant="ghost"
                size="icon"
                onClick={handleShuffle}
              >
                <Shuffle
                  style={{
                    filter:
                      "drop-shadow(0px 0px 2px hsl(120, 100%, 80%)) drop-shadow(0px 0px 8px green)",
                  }}
                  color="#fbfbf3"
                  strokeWidth={2.5}
                  className="h-[1.5rem] w-[1.3rem]"
                />
              </Button>
              <Button
                disabled={isLoading}
                variant="ghost"
                size="icon"
                onClick={handlePrev}
              >
                <Rewind
                  style={{
                    filter:
                      "drop-shadow(0px 0px 2px hsl(120, 100%, 80%)) drop-shadow(0px 0px 8px green)",
                  }}
                  color="#fbfbf3"
                  strokeWidth={2.5}
                  className="h-[1.5rem] w-[1.3rem]"
                />
              </Button>
              <Button
                disabled={isLoading}
                variant="ghost"
                size="icon"
                onClick={handleNext}
              >
                <FastForward
                  style={{
                    filter:
                      "drop-shadow(0px 0px 2px hsl(120, 100%, 80%)) drop-shadow(0px 0px 8px green)",
                  }}
                  color="#fbfbf3"
                  strokeWidth={2.5}
                  className="h-[1.5rem] w-[1.3rem]"
                />
              </Button>
              <SettingsSheet />
            </div>

            <div className="flex m-10 mb-12 space-x-1">
              <Button variant="ghost" size="icon" onClick={handleClear}>
                <CircleX
                  style={{
                    filter:
                      "drop-shadow(0px 0px 2px hsl(120, 100%, 80%)) drop-shadow(0px 0px 8px green)",
                  }}
                  color="#fbfbf3"
                  strokeWidth={2.5}
                  className="h-[1.5rem] w-[1.3rem]"
                />
              </Button>
              <FullScreenToggle />
              <SaveList onPlayListItem={onPlayListItem} />
              <MyTimer />

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Heart
                      style={{
                        filter:
                          "drop-shadow(0px 0px 2px hsl(120, 100%, 80%)) drop-shadow(0px 0px 8px green)",
                      }}
                      color="#fbfbf3"
                      strokeWidth={2.5}
                      className="h-[1.5rem] w-[1.3rem]"
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-48 p-3 bg-gray-900 text-white"
                  side="top"
                  align="end"
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleMailClick}
                        className="h-8 w-8"
                      >
                        <Mail
                          style={{
                            filter:
                              "drop-shadow(0px 0px 2px hsl(120, 100%, 80%)) drop-shadow(0px 0px 8px green)",
                          }}
                          color="#fbfbf3"
                          strokeWidth={2.5}
                          className="h-4 w-4"
                        />
                      </Button>
                      <span className="text-sm">Mail</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <a
                        href="https://github.com/maxilong258/atmosphere"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Github
                            style={{
                              filter:
                                "drop-shadow(0px 0px 2px hsl(120, 100%, 80%)) drop-shadow(0px 0px 8px green)",
                            }}
                            color="#fbfbf3"
                            strokeWidth={2.5}
                            className="h-4 w-4"
                          />
                        </Button>
                      </a>
                      <span className="text-sm">GitHub</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <a
                        href="https://x.com/MaxiLong1234"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Twitter
                            style={{
                              filter:
                                "drop-shadow(0px 0px 2px hsl(120, 100%, 80%)) drop-shadow(0px 0px 8px green)",
                            }}
                            color="#fbfbf3"
                            strokeWidth={2.5}
                            className="h-4 w-4"
                          />
                        </Button>
                      </a>
                      <span className="text-sm">Twitter</span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* <div className="flex m-8 mt-3">
            {currentVideoUrl && isPlaying && (
              <TvMinimalPlay
                color="#fbfbf3"
                strokeWidth={2.5}
                className="mr-5 w-6 h-6"
              />
            )}
            {currentAudio.length ? (
              currentAudio.map((item) => {
                const iconSrc = `/icons/${item.soundName}.png`;
                return (
                  <Image
                    key={iconSrc}
                    src={iconSrc}
                    alt="Currently Playing"
                    className="mr-5 w-6 h-6"
                    width={100}
                    height={100}
                  />
                );
              })
            ) : (
            <div className="mr-5 w-6 h-6" />
            )}
          </div> */}
        </>
      )}
    </div>
  );
};
