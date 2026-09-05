"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { workExperienceDuration } from "@/lib/utils";
import { getAllSkills } from "@/lib/skills";
import { getSiteSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { TechIcon } from "@/components/tech-icons";

type Skill = {
  slug: string;
  title: string;
  items: string[];
  icons: string[];
};

export default function About() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    (async () => {
      setSettings(await getSiteSettings());
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const all = await getAllSkills();
        setSkills(
          all.map((s) => ({
            slug: s.slug,
            title: s.title,
            items: s.items || [],
            icons: s.icons || [],
          })),
        );
      } catch (e) {
        console.warn("Failed to load skills from Supabase", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  return (
    <section
      id="about"
      className="py-24 relative grid-bg bg-emerald-50/30 dark:bg-emerald-950/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-600 font-mono text-[10px] tracking-[0.3em] uppercase">
                About
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              {settings.about_title_line1} <br />
              <span className="text-emerald-500 italic font-light text-5xl md:text-6xl">
                {settings.about_title_line2}
              </span>
            </h2>

            <div
              className="space-y-4 text-lg text-muted-foreground leading-relaxed mb-10 [&>p]:mb-4"
              dangerouslySetInnerHTML={{
                __html: settings.about_bio.replaceAll(
                  "{{years}}",
                  workExperienceDuration(settings.career_start),
                ),
              }}
            />

          </motion.div>

          <div className="space-y-10">
            {!loaded ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 animate-pulse">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="h-[76px] rounded-xl bg-muted"
                  />
                ))}
              </div>
            ) : (
              skills
                .filter((skill) => (skill.items || []).length > 0)
                .map((skill, index) => (
                <motion.div
                  key={skill.slug}
                  initial={mounted ? { opacity: 0, y: 20 } : false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-600 mb-4">
                    {skill.title}
                  </h4>
                  <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                    {skill.items.map((item, i) => (
                      <div
                        key={item}
                        className="group flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gradient-to-br from-secondary/20 to-transparent border border-border hover:border-emerald-500/40 transition-all"
                      >
                        <span className="text-emerald-500 group-hover:scale-110 transition-transform">
                          <TechIcon icon={skill.icons?.[i]} size={28} />
                        </span>
                        <span className="text-[11px] font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )))}
          </div>
        </div>
      </div>
    </section>
  );
}
