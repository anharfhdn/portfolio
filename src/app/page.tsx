"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import BlogPreview from "@/components/sections/BlogPreview";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import Philosophy from "@/components/sections/Philosophy";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <About />
        <Projects />
        <BlogPreview />
        <Philosophy />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
