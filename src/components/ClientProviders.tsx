"use client";

import { ThemeProvider } from "@/components/theme-provider";
import ErrorReporter from "@/components/ErrorReporter";
import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <Providers>
        {children}
        <ErrorReporter />
        <Toaster />
      </Providers>
    </ThemeProvider>
  );
}
