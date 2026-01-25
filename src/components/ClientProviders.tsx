"use client";

import { ThemeProvider } from "next-themes";
import VisualEditsMessenger from "@/visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import { Providers } from "@/components/Providers";
import Script from "next/script";
import { Toaster } from "sonner";

export default function ClientProviders({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider attribute="class" defaultTheme="light">
            <Providers>
                <Script
                    id="orchids-browser-logs"
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
                    strategy="afterInteractive"
                    data-orchids-project-id="f2e05fe4-aea1-4c39-bce1-1256ba44eb6f"
                />
                <ErrorReporter />
                <Script
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
                    strategy="afterInteractive"
                    data-target-origin="*"
                    data-message-type="ROUTE_CHANGE"
                    data-include-search-params="true"
                    data-only-in-iframe="true"
                    data-debug="true"
                    data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
                />
                {children}
                <VisualEditsMessenger />
                <Toaster />
            </Providers>
        </ThemeProvider>
    );
}
