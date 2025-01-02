"use client"

import FullScreenToggle from "@/components/full_screen_toggle";
import { useSettingsStore } from "@/store/settings_store";

export function SiteHeader() {
  const { isInited } = useSettingsStore();

  return (
    <header className="sticky top-0 z-40 w-full">
      {isInited && (
        <div className="flex items-center justify-between px-8 py-6">
          <div></div>
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-1">
              <FullScreenToggle />
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
