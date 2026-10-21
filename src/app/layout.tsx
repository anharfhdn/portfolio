import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import ClientProviders from "@/components/ClientProviders";
import { getSiteSettings } from "@/lib/settings";
import "./globals.css";

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host-grotesk",
  weight: ["400", "500", "600", "700"],
});

const settings = await getSiteSettings();

export const metadata: Metadata = {
  title: settings.meta_title,
  description: settings.meta_description,
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${hostGrotesk.variable} font-sans antialiased`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
