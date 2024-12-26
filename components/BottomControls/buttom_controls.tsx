"use client";

import { useAudioStore } from "@/store/audio_store";
import { useVideoStore } from "@/store/video_store";
import { TvMinimalPlay } from "lucide-react";
import Image from 'next/image'

export const BottomControls = () => {
  const { audios } = useAudioStore();
  const { currentVideoUrl, isPlaying } = useVideoStore();

  // 找到当前正在播放的音频
  const currentAudio = Object.values(audios).filter((audio) => audio.isPlaying);

  return (
    <div className="z-40 absolute bottom-0 ">
      <div className="flex m-9">
        {currentVideoUrl && isPlaying && (
          <TvMinimalPlay strokeWidth={1.2} className="mr-5 w-7 h-" />
        )}
        {currentAudio.map((item) => {
          const iconSrc = `/icons/${item.soundName}.png`;
          return (
            <Image
              key={iconSrc}
              src={iconSrc}
              alt="Currently Playing"
              className="mr-5 w-7 h-7"
              width={100}
              height={100}
            />
          );
        })}
      </div>
    </div>
  );
};
