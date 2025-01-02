"use client";

import { useBackgroundStore } from "@/store/bg_store";
import styles from "./bg.module.css";
import BackgroundPlayer from "@/components/VideoPlayer/video_player";
import { useSettingsStore } from "@/store/settings_store";
import Image from "next/image";

export default function IndexPage() {
  const { currentBackground } = useBackgroundStore();
  const { isSheetOpen } = useSettingsStore();

  return (
    <div className="w-screen h-screen overflow-hidden relative"
      style={{
        transform: isSheetOpen ? 'scale(0.99, 0.97)' : 'scale(1)',
        borderRadius: isSheetOpen ? '15px' : '0', // 根据状态添加圆角
        transition: 'transform 0.3s ease, border-radius 0.3s ease' // 添加过渡效果
      }}
    >
      <BackgroundPlayer />
      <Image
        className="w-full h-full object-cover"
        src={currentBackground ?? "/bgs/white-noise.gif"}
        width={"100"}
        height={"100"}
        alt=""
      />
      <div className={styles.crtLines}></div>
      <div className={styles.darken}></div>
      <div className={styles.vignette}></div>
    </div>
  );
}
