"use client";

import { ThemeProvider } from "@/components/theme-provider";
import ErrorReporter from "@/components/ErrorReporter";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import Aurora from "@/components/bits/Aurora";
import ClickSpark from "@/components/bits/ClickSpark";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <Providers>
        <div className="fixed inset-0 -z-10" aria-hidden="true">
          <Aurora />
        </div>
        {children}
        <ClickSpark />
        <ErrorReporter />
        <Toaster />
      </Providers>
    </ThemeProvider>
  );
}
