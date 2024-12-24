"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed, Pause, Play, Settings2, Volume2 } from "lucide-react";
import { AudioControl } from "@/components/AudioControl/audio_control";
import { BgControl } from "./BgControl/bg_control";
import { useVideoStore } from "@/store/video_store";
import { Input } from "./ui/input";
import { Slider } from "@/components/ui/slider";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";

export const SettingsSheet = () => {
  const {
    currentVideoUrl,
    setVideoUrl,
    isVideoVisible,
    toggleVideoVisibility,
    volume,
    setVolume,
    isPlaying,
    togglePlayPause,
    // duration,
    // progress,
    // setProgress,
    // seekTo
  } = useVideoStore();

  const [inputValue, setInputValue] = useState("");

  const [debouncedValue] = useDebounce(inputValue, 500);

  useEffect(() => {
    setVideoUrl(debouncedValue);
  }, [debouncedValue, setVideoUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // 更新本地状态
    //   // const params = new URLSearchParams(searchParams);
    //   // if (term) {
    //   //   params.set('query', term);
    //   // } else {
    //   //   params.delete('query');
    //   // }
    //   // replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    setInputValue(currentVideoUrl)
  }, [currentVideoUrl])

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings2 className="h-[1.5rem] w-[1.3rem] text-gray-300" />
        </Button>
      </SheetTrigger>
      <SheetContent style={{ maxWidth: "75vw" }} className=" bg-black/60 ">
        <SheetHeader>
          <SheetTitle></SheetTitle>

          <SheetDescription>
            <span className="text-2xl text-white font-bold m-3 block">
              Video Link
            </span>

            <span className="block mx-3 mt-6 mb-9">
              <Input
                type="text"
                placeholder="Paste youtube link"
                value={inputValue}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-2 py-1 w-[500px]"
              />
              {currentVideoUrl && (
                <span className="flex items-center gap-3 mt-3">
                  <Button
                    onClick={togglePlayPause}
                    className="px-4 py-2 bg-gray-500 text-gray-300 rounded"
                  >
                    {isPlaying ? <Pause /> : <Play />}
                  </Button>
                  {/* <Slider
                    style={{ width: "300px", height: "10px" }}
                    min={0}
                    step={1}
                    max={duration}
                    value={[progress]}
                    onValueChange={(value) => {
                      console.log("Seeking to:", value[0]); // 打印跳转时间
                      seekTo(value[0]); // 调用跳转方法
                    }}
                  /> */}
                  <Button
                    onClick={toggleVideoVisibility}
                    className="px-4 py-2 bg-gray-500 text-gray-300 rounded"
                  >
                    {isVideoVisible ? <EyeClosed /> : <Eye />}
                  </Button>
                  <Volume2 />
                  <Slider
                    style={{ width: "90px", height: "10px" }}
                    min={0}
                    step={1}
                    max={100}
                    defaultValue={[volume]}
                    onValueChange={handleVolumeChange}
                  />
                </span>
              )}
            </span>

            <span className="text-2xl text-white font-bold m-3 block">
              Nature
            </span>
            <AudioControl soundName="light-rain" />
            <AudioControl soundName="heavy-rain" />
            <AudioControl soundName="thunder" />
            <AudioControl soundName="rain-on-window" />

            <span className="text-2xl text-white font-bold m-3 block">
              City
            </span>
            <AudioControl soundName="train" />

            <span className="text-2xl text-white font-bold m-3 block">
              Background
            </span>

            <BgControl bgName="rain-street" />
            <BgControl bgName="retrowave" />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
