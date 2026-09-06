"use client";

import { useTheme } from "@/components/theme-provider";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "color-mix(in srgb, var(--popover) 65%, transparent)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "color-mix(in srgb, var(--border) 60%, transparent)",
        } as React.CSSProperties
      }
      toastOptions={{
        className: "backdrop-blur-xl shadow-lg rounded-2xl",
      }}
      {...props}
    />
  );
};

export { Toaster };
