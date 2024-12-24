import FullScreenToggle from "@/components/full_screen_toggle";
import { SettingsSheet } from "@/components/settings_sheet";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="flex items-center justify-between px-8 py-6">
        <div></div>
        <div className="flex items-center space-x-4">
          <nav className="flex items-center space-x-1">
            <FullScreenToggle />
            <SettingsSheet />
          </nav>
        </div>
      </div>
    </header>
  );
}
