"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { useTheme } from "next-themes";
import { config } from "../../wallet.config";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const customLightTheme = lightTheme({
    accentColor: "#10b981",
    accentColorForeground: "white",
    borderRadius: "medium",
  });

  const customDarkTheme = darkTheme({
    accentColor: "#10b981",
    accentColorForeground: "white",
    borderRadius: "medium",
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={
            mounted
              ? resolvedTheme === "dark"
                ? customDarkTheme
                : customLightTheme
              : customLightTheme
          }
          coolMode
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
