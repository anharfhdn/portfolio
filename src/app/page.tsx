"use client"; // Add this if not already there

import ClientProviders from "@/components/ClientProviders";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <ClientProviders>
            <div className="flex flex-col min-h-screen bg-background">
                <Navbar />
                <main className="flex-grow">
                    <Hero />
                    <About />
                    <Projects />
                    <Contact />
                </main>
                <Footer />
            </div>
        </ClientProviders>
    );
}
