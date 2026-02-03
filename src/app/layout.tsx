import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import ClientProviders from "@/components/ClientProviders";
import "./globals.css";

const instrumentSans = Instrument_Sans({
    subsets: ["latin"],
    variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
    title: "Anhar F | Full-Stack | Web3",
    description: "Engineering robust software at the intersection of Industrial Automation & Decentralized Protocols. 3+ years building reliable, scalable Web3 systems.",
    icons: {
        icon: '/favicon.png',
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${instrumentSans.variable} font-sans antialiased`}>
        <ClientProviders>
            {children}
        </ClientProviders>
        </body>
        </html>
    );
}
