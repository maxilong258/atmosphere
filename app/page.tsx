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

export default function IndexPage() {
  const { currentBackground, loadBgFromUrl } = useBackgroundStore();
  const { loadVideoFromUrl } = useVideoStore();
  const loadFromUrl = useAudioStore((state) => state.loadFromUrl);

  const [showDialog, setShowDialog] = useState(false);
  const [audioStateLoaded, setAudioStateLoaded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const soundsParam = params.get("sounds");

    if (soundsParam && !audioStateLoaded) {
      setShowDialog(true);
    }
  }, [audioStateLoaded]);

  useEffect(() => {
    loadBgFromUrl();
  }, [loadBgFromUrl]);

  useEffect(() => {
    loadVideoFromUrl();
  }, [loadVideoFromUrl]);

  const handleConfirm = () => {
    setShowDialog(false);
    setAudioStateLoaded(true);
    loadFromUrl(); // 加载音频状态
  };

  const handleCancel = () => {
    // 用户选择取消播放
    const params = new URLSearchParams(window.location.search);

    // 删除 `sounds` 参数，仅保留其他参数
    params.delete("sounds");

    // 更新 URL，仅修改 `sounds` 参数
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`
    );

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
