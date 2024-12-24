"use client"

import React, { useState } from "react";
import screenfull from "screenfull";
import { Button } from "./ui/button";
import { Maximize2, Minimize2 } from "lucide-react";

const FullScreenToggle = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreenToggle = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle(); // 切换全屏
    }
  };

  // 监听全屏状态变化
  React.useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(screenfull.isFullscreen);
    };

    // 绑定全屏变化事件
    if (screenfull.isEnabled) {
      screenfull.on("change", onFullscreenChange);
    }

    // 清理事件监听
    return () => {
      if (screenfull.isEnabled) {
        screenfull.off("change", onFullscreenChange);
      }
    };
  }, []);

  return (
    <Button onClick={handleFullscreenToggle} variant="ghost" size="icon">
      {isFullscreen ? (
        <Minimize2 className="h-[1.5rem] w-[1.3rem] text-gray-400"/>
      ) : (
        <Maximize2 className="h-[1.5rem] w-[1.3rem] text-gray-400"/>
      )}
    </Button>
  );
};

export default FullScreenToggle;
