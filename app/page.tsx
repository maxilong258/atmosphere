"use client";

import { useBackgroundStore } from "@/store/bg_store";
import styles from "./bg.module.css";
import BackgroundPlayer from "@/components/VideoPlayer/video_player";
import { getPlayingAudios, useAudioStore } from "@/store/audio_store";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useVideoStore } from "@/store/video_store";
import { updateUrlParams } from "@/lib/urlUtils";
import { useSettingsStore } from "@/store/settings_store";
import Image from "next/image";

export default function IndexPage() {
  const { currentBackground, loadBgFromUrl } = useBackgroundStore();
  const { currentVideoUrl, cleanVideo, loadVideoFromUrl, setChackVideoDone } = useVideoStore();
  const { audios, cleanAudios, loadAudioFromUrl } = useAudioStore();
  const { openSheet } = useSettingsStore();
  const [showDialog, setShowDialog] = useState(false);
  const [isInit, setIsInit] = useState(true)

  useEffect(() => {
    if (!isInit) return;
    const timeout = setTimeout(() => {
      setIsInit(false)

      const params = new URLSearchParams(window.location.search);
      const soundsParam =
        params.get("sounds") ||
        Object.keys(getPlayingAudios(audios)).length !== 0;
      const videoParam = params.get("video") || currentVideoUrl

      if (videoParam || soundsParam) {
        setShowDialog(true);
      } else {
        setChackVideoDone()
        openSheet();
      }

    }, 2000);
    return () => clearTimeout(timeout); // 清理定时器
  }, [audios, currentVideoUrl, openSheet, isInit, setChackVideoDone]);

  useEffect(() => {
    loadBgFromUrl();
  }, [loadBgFromUrl]);

  const handleConfirm = () => {
    setShowDialog(false);
    loadAudioFromUrl(); // 加载音频状态
    loadVideoFromUrl();
  };

  const handleCancel = () => {
    updateUrlParams({ sounds: null });
    cleanAudios();
    updateUrlParams({ video: null });
    cleanVideo();
    setChackVideoDone();
    setShowDialog(false);
    setTimeout(() => {
      openSheet();
    }, 500);
  };

  const changeOpen = () => {
    if (showDialog) {
      handleCancel();
    } else {
      setShowDialog(true);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative">
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
      <Dialog open={showDialog} onOpenChange={changeOpen}>
        <DialogContent>
          <DialogTitle>Continue playing?</DialogTitle>
          <DialogFooter>
            <Button variant="secondary" onClick={handleCancel}>
              cancel
            </Button>
            <Button onClick={handleConfirm}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
