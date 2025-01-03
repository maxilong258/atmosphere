"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";

const TimerApp = () => {
  const defaultTime = 25 * 60; // 默认 25 分钟（秒为单位）
  const [timeLeft, setTimeLeft] = useState(defaultTime); // 定时器剩余时间
  const [isTimerActive, setIsTimerActive] = useState(false); // 定时器是否启动
  const [isTimerFinished, setIsTimerFinished] = useState(false); // 定时器是否结束
  const [isEditingTime, setIsEditingTime] = useState(false); // 是否处于编辑状态
  const [newTime, setNewTime] = useState(timeLeft / 60); // 新时间，默认与当前时间一致（分钟为单位）

  // 提示音的播放
  const playAlarmSound = () => {
    const alarm = new Audio("/sounds/aaa-ding.mp3"); // 替换为实际的音频文件路径
    alarm.play();
  };

  // 开始或暂停定时器
  const toggleTimer = () => {
    if (isTimerFinished) {
      // 如果定时器已经结束，点击开始按钮时重置定时器为默认时间
      setTimeLeft(defaultTime);
      setIsTimerFinished(false); // 重置定时器结束状态
    }
    setIsTimerActive((prev) => !prev); // 切换定时器状态
  };

  // 加 5 分钟
  const addFiveMinutes = () => {
    setTimeLeft((prev) => prev + 5 * 60); // 加 5 分钟
  };

  // 每秒更新一次剩余时间
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerFinished(true);
      setIsTimerActive(false); // 停止计时
      playAlarmSound(); // 播放提示音
    }

    // 清除计时器
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerActive, timeLeft]);

  // 格式化剩余时间
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  // 提交新时间
  const handleSetNewTime = () => {
    if (newTime && newTime > 0) {
      setTimeLeft(newTime * 60); // 设置新的定时器时间（以分钟为单位）
    }
    setIsEditingTime(false); // 退出编辑模式
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <Clock
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

        <PopoverContent className="bg-transparent border-none shadow-none w-40 flex justify-center flex-col">
          {/* 时间显示或者输入 */}
          <Button style={{textShadow: "2px 2px 4px rgba(235, 235, 0, 0.6)",}}  className="block font-bold" variant="link" onClick={() => setIsEditingTime(true)}>
            {isEditingTime ? (
              <div className="flex justify-center items-center">
                <input
                  type="number"
                  value={newTime}
                  onChange={(e) => setNewTime(Number(e.target.value))}
                  className="border p-1 rounded text-center w-16"
                />
              </div>
            ) : (
              isTimerFinished ? "Time's up!" : formatTime(timeLeft)
            )}
          </Button>

          {/* 开始/暂停按钮 */}
          <Button style={{textShadow: "2px 2px 4px rgba(235, 235, 0, 0.6)",}}  className="block font-bold" variant="link" onClick={isEditingTime ? handleSetNewTime : toggleTimer}>
            {isEditingTime ? 'Done' : isTimerActive ? "Pause" : "Start"}
          </Button>

          {/* 加 5 分钟按钮 */}
          <Button
            className="block font-bold"
            variant="link"
            onClick={addFiveMinutes}
            disabled={isTimerFinished}
            style={{textShadow: "2px 2px 4px rgba(235, 235, 0, 0.6)",}} 
          >
            +5:00
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TimerApp;
