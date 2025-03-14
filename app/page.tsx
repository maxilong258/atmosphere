"use client";

import { useBackgroundStore } from "@/store/bg_store";
import styles from "./bg.module.css";
import BackgroundPlayer from "@/components/VideoPlayer/video_player";
import { useSettingsStore } from "@/store/settings_store";
// import Image from "next/image";

export default function IndexPage() {
  const { currentBackground } = useBackgroundStore();
  const { isSheetOpen, isShowLayer } = useSettingsStore();

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <BackgroundPlayer />
      <img
        className="w-full h-full object-cover"
        style={{
          padding: isSheetOpen ? "15px" : "0",
          borderRadius: isSheetOpen ? "30px" : "0", // 根据状态添加圆角
          transition: "padding 0.3s ease, border-radius 0.3s ease", // 添加过渡效果
        }}
        src={currentBackground ?? "/bgs/loading1.gif"}
        width={"100"}
        height={"100"}
        alt=""
      />
      {isShowLayer && (
        <div>
          <div className={styles.crtLines}></div>
          <div className={styles.darken}></div>
          <div className={styles.vignette}></div>
        </div>
      )}
    </div>
  );
}
