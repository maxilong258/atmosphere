import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useAudioStore } from "@/store/audio_store"; // 导入 store
import Image from 'next/image'

interface AudioControlProps {
  soundName: string; // 音频文件的 URL
}

function formatString(input: string) {
  return input
    .split('-')
    .map((word, index) => {
      if (index === 0) {
        // 第一个单词首字母大写
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      // 其他单词全小写
      return word.toLowerCase();
    })
    .join(' ');
}

export const AudioControl = ({
  soundName,
}: AudioControlProps) => {
  const soundUrl = `/sounds/${soundName}.mp3`
  const iconSrc = `/icons/${soundName}.png`
  const iconGraySrc = `/icons/${soundName}-gray.png`
  const iconAlt = formatString(soundName);

  const { audios, toggleAudio, setVolume } = useAudioStore(); // 使用 Zustand store
  const currentAudio = audios[soundUrl] || { isPlaying: false, volume: 1 }; // 默认状态

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(soundUrl, newVolume);
  };


  return (
    <span className="m-3 inline-block align-bottom">
      <Button
        variant="ghost"
        onClick={() => toggleAudio(soundUrl)}
        style={{ height: "90px", width: "90px" }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Image
                src={currentAudio.isPlaying ? iconSrc : iconGraySrc}
                alt={iconAlt}
                width={100}
                height={100}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{iconAlt}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Button>
      {currentAudio.isPlaying && (
        <Slider
          style={{ width: "90px", marginTop: "-4px" }}
          defaultValue={[currentAudio.volume]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
        />
      )}
    </span>
  );
};
