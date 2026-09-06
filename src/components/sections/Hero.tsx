"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import ResumeButton from "@/components/ui/ResumeButton";
import { workExperienceDuration } from "@/lib/utils";
import { getSiteSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { useEffect, useState } from "react";

export default function Hero() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    (async () => {
      setSettings(await getSiteSettings());
    })();
  }, []);
  return (
    <section className="relative flex items-center justify-center overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">
            {settings.availability_badge}
          </p>

          <h1 className="text-5xl md:text-7xl text-muted-foreground font-medium italic tracking-tight leading-[1.05]">
            {settings.hero_title_line1}
          </h1>
          <h1 className="text-5xl md:text-8xl font-bold italic tracking-tight mb-8 leading-[1.05]">
            {settings.hero_title_line2}
          </h1>
          <p
            className="max-w-4xl mx-auto text-lg md:text-xl text-muted-foreground mb-20 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: settings.hero_bio.replaceAll(
                "{{years}}",
                workExperienceDuration(settings.career_start),
              ),
            }}
          />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-muted/50 px-7 py-3.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              View Projects
              <ArrowRight
                className="group-hover:translate-x-1 transition-transform"
                size={16}
              />
            </Link>

            <ResumeButton />

            <Link
              href="/#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-muted/50 px-7 py-3.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              <Mail size={16} />
              Contact Me
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
