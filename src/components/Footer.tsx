"use client";

import { useEffect, useState } from "react";
import { getSiteSettings, DEFAULT_SETTINGS } from "@/lib/settings";

export default function Footer() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    (async () => {
      setSettings(await getSiteSettings());
    })();
  }, []);
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {settings.profile_name}. All rights reserved.
        </p>

        <p className="text-sm text-muted-foreground">
          Built with Next.js & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
