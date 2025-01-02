import type { Metadata } from "next";
import "@/styles/globals.css";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { OpeningEffect } from "@/components/OpeningEffect/opening_effect";
import { BottomControls } from "@/components/BottomControls/buttom_controls";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <OpeningEffect>
              <div className="relative flex min-h-screen flex-col">
                {/* <SiteHeader /> */}
                <div className="absolute top-0 bottom-0 left-0 right-0">
                  {children}
                </div>
                <BottomControls />
              </div>
            </OpeningEffect>
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
