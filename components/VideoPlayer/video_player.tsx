import { useEffect, useRef } from "react";
import { useVideoStore } from "@/store/video_store";

export default function BackgroundPlayer() {
  const {
    currentVideoUrl,
    isVideoVisible,
    volume,
    isPlaying,
    // progress,
    // setProgress,
    // setDuration,
  } = useVideoStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const getVideoIdFromUrl = (url: string): string => {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : "";
  };

  const postMessageToPlayer = (message: object) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        ...message,
      }),
      "*"
    );
  };

  // 设置音量
  useEffect(() => {
    postMessageToPlayer({ func: "setVolume", args: [volume] });
  }, [volume]);

  // 播放/暂停
  useEffect(() => {
    postMessageToPlayer({ func: isPlaying ? "playVideo" : "pauseVideo" });
  }, [isPlaying]);

  // // 跳转到指定时间
  // useEffect(() => {
  //   postMessageToPlayer({ func: "seekTo", args: [progress, true] });
  // }, [progress]);

  // 接收播放进度和总时长
  // useEffect(() => {
  //   const handleMessage = (event: MessageEvent) => {
  //     if (event.data && typeof event.data === "string") {
  //       const data = JSON.parse(event.data);
  //       if (data.event === "infoDelivery") {
  //         const { currentTime, duration } = data.info || {};
  //         // console.log("Current Time:", currentTime, "Duration:", duration);
  //         if (currentTime !== undefined) setProgress(currentTime);
  //         if (duration !== undefined) setDuration(duration);
  //       }
  //     }
  //   };
  //   window.addEventListener("message", handleMessage);
  //   return () => window.removeEventListener("message", handleMessage);
  // }, [setProgress, setDuration]);
  

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden transition-opacity duration-300 z-0 ${
        isVideoVisible ? "opacity-100 z-0" : "opacity-0 -z-10"
      }`}
    >
      {currentVideoUrl && (
        <iframe
          ref={iframeRef}
          className="absolute top-0 left-0 w-full h-full scale-[1.33]"
          src={`https://www.youtube.com/embed/${getVideoIdFromUrl(
            currentVideoUrl
          )}?autoplay=1&loop=1&cc_load_policy=0&controls=0&playlist=${getVideoIdFromUrl(
            currentVideoUrl
          )}&enablejsapi=1`}
          title="YouTube Video"
          allow="autoplay; fullscreen"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
}
