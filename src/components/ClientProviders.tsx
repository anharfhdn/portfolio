"use client";

import { ThemeProvider } from "next-themes";
import VisualEditsMessenger from "@/visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <Providers>
        {children}
        <VisualEditsMessenger />
        <ErrorReporter />
        <Toaster />
      </Providers>
    </ThemeProvider>
  );
}
