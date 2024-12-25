"use client";

import { useBackgroundStore } from "@/store/bg_store";
import styles from "./bg.module.css";
import BackgroundPlayer from "@/components/VideoPlayer/video_player";
import { useAudioStore } from "@/store/audio_store";
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

export default function IndexPage() {
  const { currentBackground, loadBgFromUrl } = useBackgroundStore();
  const { loadVideoFromUrl } = useVideoStore();
  const { loadAudioFromUrl } = useAudioStore();
  const { openSheet } = useSettingsStore();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const soundsParam = params.get("sounds");
    const videoParam = params.get("video");
    if (videoParam || soundsParam) {
      setTimeout(() => {
        setShowDialog(true);
      }, 800);
    }
     else {
      setTimeout(() => {
        openSheet();
      }, 1500) 
    }
  }, []);

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
    updateUrlParams({ video: null });
    setShowDialog(false);
    setTimeout(() => {
      openSheet();
    }, 500);
  };

  const changeOpen = () => {
    if (showDialog) {
      handleCancel()
    } else {
      setShowDialog(true)
    }
  }

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <BackgroundPlayer />
      <img
        className="w-full h-full object-cover"
        src={currentBackground}
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
