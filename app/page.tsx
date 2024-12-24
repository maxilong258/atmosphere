"use client";

import { useBackgroundStore } from "@/store/bg_store";
import styles from "./bg.module.css";
import BackgroundPlayer from "@/components/VideoPlayer/video_player";
import { useAudioStore } from "@/store/audio_store";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useVideoStore } from "@/store/video_store";
import { updateUrlParams } from "@/lib/urlUtils";

export default function IndexPage() {
  const { currentBackground, loadBgFromUrl } = useBackgroundStore();
  const { loadVideoFromUrl } = useVideoStore();
  const { loadAudioFromUrl } = useAudioStore();

  const [showDialog, setShowDialog] = useState(false);
  const [audioStateLoaded, setAudioStateLoaded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const soundsParam = params.get("sounds");
    const videoParam = params.get("video");

    if ( (videoParam || soundsParam) && !audioStateLoaded) {
      setShowDialog(true);
    }
  }, [audioStateLoaded]);

  useEffect(() => {
    loadBgFromUrl();
  }, [loadBgFromUrl]);

  const handleConfirm = () => {
    setShowDialog(false);
    setAudioStateLoaded(true);
    loadAudioFromUrl(); // 加载音频状态
    loadVideoFromUrl()
  };

  const handleCancel = () => {
    const params = new URLSearchParams(window.location.search);
    updateUrlParams({sounds: null})
    setShowDialog(false);
  };

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
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
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
