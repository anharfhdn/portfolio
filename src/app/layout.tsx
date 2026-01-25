import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
    subsets: ["latin"],
    variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
    title: "Portfolio | Next.js",
    description: "Modern portfolio with blog feature",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${instrumentSans.variable} font-sans antialiased`}>
        {children}
        </body>
        </html>
    );
}
