import React, { useState, useEffect, useRef } from "react";

interface TypingEffectProps {
  text: string;
  speed?: number;
}

const TypingEffect = ({ text, speed = 50 }: TypingEffectProps) => {
  const [displayedText, setDisplayedText] = useState(""); // 用于存储已显示的文字
  const [isCursorVisible, setIsCursorVisible] = useState(true); // 控制光标是否可见
  const currentIndexRef = useRef(0); // 使用 useRef 来存储 currentIndex，避免闭包问题

  useEffect(() => {
    // 延迟 2 秒开始打字
    const delayTimer = setTimeout(() => {
      const typingTimer = setInterval(() => {
        if (currentIndexRef.current < text.length) {
          // 确保只有在字符存在时才进行拼接
          setDisplayedText(
            (prevText) => prevText + text[currentIndexRef.current - 1]
          );
          currentIndexRef.current += 1; // 更新 currentIndexRef
        } else {
          clearInterval(typingTimer); // 打字完成后清除定时器
        }
      }, speed);

      return () => clearInterval(typingTimer);
    }, 2000); // 延迟 2 秒开始打字

    return () => clearTimeout(delayTimer); // 清除延迟定时器
  }, [text, speed]); // text 和 speed 作为依赖项

  useEffect(() => {
    // 光标闪烁效果
    const cursorInterval = setInterval(() => {
      setIsCursorVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval); // 清除光标闪烁定时器
  }, []);

  return (
    <div className="inline-block">
      <span
        style={{
          display: "inline-block",
          fontWeight: 'bold',
          textShadow: "2px 2px 4px rgba(235, 235, 0, 0.6)", // 添加红色阴影
        }}
      >
        {displayedText}
      </span>
      <span
        className="inline-block w-3 h-5 bg-gray-300 ml-1 align-text-bottom"
        style={{
          visibility: isCursorVisible ? "visible" : "hidden", // 控制光标可见性
          boxShadow: "0 0 5px rgba(235, 235, 0, 0.6)", // 给光标添加发红的阴影
        }}
      ></span>
    </div>
  );
};

export default TypingEffect;
