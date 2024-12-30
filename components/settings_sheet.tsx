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
import { useSettingsStore } from "@/store/settings_store";

export const SettingsSheet = () => {
  const { isSheetOpen, closeSheet, openSheet } = useSettingsStore();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
  };

  const changeOpen = () => {
    if (isSheetOpen) {
      closeSheet();
    } else {
      openSheet();
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={changeOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings2
            className="h-[1.5rem] w-[1.3rem] text-gray-300"
          />
        </Button>
      </SheetTrigger>
      <SheetContent style={{ maxWidth: "75vw" }} className="bg-black/60 overflow-scroll">
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
                value={currentVideoUrl}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-2 py-1 max-w-[500px]"
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
            <AudioControl soundName="forest" />
            <AudioControl soundName="mountain-river" />
            <AudioControl soundName="beach" />
            <AudioControl soundName="countryside-morning" />
            <AudioControl soundName="wind" />
            <AudioControl soundName="howling-wind" />
            <AudioControl soundName="night" />
            <AudioControl soundName="water-flow" />
            <AudioControl soundName="bonfire" />
            <AudioControl soundName="wind-in-trees" />
            <AudioControl soundName="cave" />
            <AudioControl soundName="waterfall" />
            <AudioControl soundName="deep-sea" />

            <span className="text-2xl text-white font-bold m-3 block">
              Rain
            </span>
            <AudioControl soundName="light-rain" />
            <AudioControl soundName="heavy-rain" />
            <AudioControl soundName="thunder" />
            <AudioControl soundName="rain-on-window" />
            <AudioControl soundName="rain-tent" />
            <AudioControl soundName="umbrella" />
            <AudioControl soundName="rain-on-leaves" />

            <span className="text-2xl text-white font-bold m-3 block">
              Animals
            </span>
            <AudioControl soundName="birds" />
            <AudioControl soundName="seagulls" />
            <AudioControl soundName="crickets" />
            <AudioControl soundName="owl" />
            <AudioControl soundName="frog" />
            <AudioControl soundName="cat-purring" />
            <AudioControl soundName="dog-barking" />
            <AudioControl soundName="wolf" />
            <AudioControl soundName="whale" />

            <span className="text-2xl text-white font-bold m-3 block">
              Room
            </span>
            <AudioControl soundName="keyboard" />
            <AudioControl soundName="typewriter" />
            <AudioControl soundName="clock" />
            <AudioControl soundName="wind-chimes" />
            <AudioControl soundName="ceiling-fan" />

            <span className="text-2xl text-white font-bold m-3 block">
              City
            </span>
            <AudioControl soundName="cafe" />
            <AudioControl soundName="busy-street" />
            <AudioControl soundName="rowing-boat" />
            <AudioControl soundName="playground" />
            <AudioControl soundName="airport" />
            <AudioControl soundName="train" />



            <span className="text-2xl text-white font-bold m-3 block">
              Background
            </span>

            <BgControl bgName="rain-on-window" />
            <BgControl bgName="rain-street" />
            <BgControl bgName="retrowave" />
            <BgControl bgName="cruise" />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
