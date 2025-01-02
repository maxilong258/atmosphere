"use client";

import React, { useEffect, useState } from "react";
import { getPlayingAudios, useAudioStore } from "@/store/audio_store";
import { useVideoStore } from "@/store/video_store";
import {
  Shuffle,
  TvMinimalPlay,
  Rewind,
  FastForward,
  Eraser,
} from "lucide-react";
import Image from "next/image";
import { SettingsSheet } from "@/components/settings_sheet";
import { Button } from "../ui/button";
import { useBackgroundStore } from "@/store/bg_store";
import TypingEffect from "../TypingEffect/typing_effect";
import { useSettingsStore } from "@/store/settings_store";
import { updateUrlParams } from "@/lib/urlUtils";
import { PLAY_LIST } from "@/config/playlist";

export const BottomControls = () => {
  const { audios, cleanAudios } = useAudioStore();
  const { currentVideoUrl, isPlaying, cleanVideo, loadVideoFromUrl } =
    useVideoStore();
  const { loadAudioFromUrl } = useAudioStore();
  const { loadBgFromUrl, setBackground } = useBackgroundStore();
  const { isInited, setInitDone } = useSettingsStore();

  // 找到当前正在播放的音频
  const currentAudio = Object.values(audios).filter((audio) => audio.isPlaying);

  const handleShuffle = () => {
    handleClear()
    setBackground("white-noise");
    setTimeout(() => {
      const randomUrl = PLAY_LIST[Math.floor(Math.random() * PLAY_LIST.length)];
      window.history.pushState({}, "", randomUrl);
      loadVideoFromUrl();
      loadAudioFromUrl();
      loadBgFromUrl();
    }, 200);
  };

  const handleClear = () => {
    updateUrlParams({ sounds: null });
    cleanAudios();
    updateUrlParams({ video: null });
    cleanVideo();
  };

  const handlePrev = () => {
    const searchStr = window.location.search;
    handleClear()
    setBackground("white-noise");
    setTimeout(() => {
      const index = PLAY_LIST.findIndex((item) => item === searchStr)
      if (index > 0 && index < PLAY_LIST.length) {
        window.history.pushState({}, "", PLAY_LIST[index - 1]);
      } else {
        window.history.pushState({}, "", PLAY_LIST[PLAY_LIST.length - 1]);
      }
      loadVideoFromUrl();
      loadAudioFromUrl();
      loadBgFromUrl();
    }, 200);
  }

  const handleNext = () => {
    const searchStr = window.location.search;
    handleClear()
    setBackground("white-noise");
    setTimeout(() => {
      const index = PLAY_LIST.findIndex((item) => item === searchStr)
      if (index >= 0 && index < PLAY_LIST.length - 1) {
        window.history.pushState({}, "", PLAY_LIST[index + 1]);
      } else {
        window.history.pushState({}, "", PLAY_LIST[0]);
      }
      loadVideoFromUrl();
      loadAudioFromUrl();
      loadBgFromUrl();
    }, 200);
  }

  useEffect(() => {
    loadBgFromUrl();
    // 事件处理函数
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

    // 监听键盘按键事件
    const handleKeyDown = (e: KeyboardEvent) => {
      handleInteraction();
    };

    // 监听鼠标点击事件
    const handleClick = () => {
      handleInteraction();
    };

    // 添加事件监听器
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClick);

    // 清除事件监听器
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
    };
  }, [isInited]);

  return (
    <div className="z-40 absolute bottom-0 ">
      {!isInited ? (
        <div className="m-6 mb-20">
          <TypingEffect text="Press any key to start" />
        </div>
      ) : (
        <>
          <div className="flex m-6 mb-0 space-x-1">
            <SettingsSheet />
            <Button variant="ghost" size="icon" onClick={handleClear}>
              <Eraser className="h-[1.5rem] w-[1.3rem] text-gray-300" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShuffle}>
              <Shuffle className="h-[1.5rem] w-[1.3rem] text-gray-300" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handlePrev}>
              <Rewind className="h-[1.5rem] w-[1.3rem] text-gray-300" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNext}>
              <FastForward className="h-[1.5rem] w-[1.3rem] text-gray-300" />
            </Button>
          </div>

          <div className="flex m-8 mt-3">
            {currentVideoUrl && isPlaying && (
              <TvMinimalPlay strokeWidth={1.2} className="mr-5 w-6 h-6" />
            )}
            {currentAudio.length ? currentAudio.map((item) => {
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
            }) : <div className="mr-5 w-6 h-6" />}
          </div>
        </>
      )}
    </div>
  );
};
