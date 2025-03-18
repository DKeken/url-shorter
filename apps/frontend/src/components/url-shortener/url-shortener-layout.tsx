"use client";

import { ReactNode } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";

interface UrlShortenerLayoutProps {
  children: ReactNode;
}

export function UrlShortenerLayout({ children }: UrlShortenerLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 dark:from-background dark:via-background/95 dark:to-primary/10">
      <div className="absolute top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-24 max-w-6xl">
        {children}
      </div>
    </div>
  );
}
