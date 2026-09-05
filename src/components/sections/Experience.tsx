"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";
import { getAllExperience } from "@/lib/experience";

interface ExperienceItem {
  slug: string;
  company: string;
  role: string;
  period: string;
  description: string;
  location: string;
}

function renderDescription(text: string): React.ReactNode {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = (key: string) => {
    if (bullets.length === 0) return;
    blocks.push(
      <ul key={key} className="list-disc pl-5 space-y-1">
        {bullets.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  lines.forEach((line, i) => {
    const bullet = line.match(/^([-*•])\s+(.*)$/);
    if (bullet) {
      bullets.push(bullet[2]);
    } else {
      flushBullets(`ul-${i}`);
      blocks.push(<p key={`p-${i}`}>{line}</p>);
    }
  });
  flushBullets("ul-end");

  return <div className="space-y-2">{blocks}</div>;
}

export default function Experience() {
  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    (async () => {
      const all = await getAllExperience();
      setItems(
        all.map((e) => ({
          slug: e.slug,
          company: e.company,
          role: e.role,
          period: e.period || "",
          description: e.description || "",
          location: e.location || "",
        })),
      );
      setLoaded(true);
    })();
  }, []);

  if (loaded && items.length === 0) return null;

  return (
    <section
      id="experience"
      className="py-24 relative grid-bg bg-emerald-50/30 dark:bg-emerald-950/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-600 font-mono text-[10px] tracking-[0.3em] uppercase">
              Experience
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
            WORK <br />
            <span className="text-emerald-500 italic font-light text-5xl md:text-6xl">
              HISTORY
            </span>
          </h2>
        </div>

        <div className="space-y-6">
          {!loaded ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="p-6 rounded-2xl border border-border bg-background/60 animate-pulse"
              >
                <div className="h-6 w-1/3 rounded bg-muted mb-3" />
                <div className="h-4 w-1/2 rounded bg-muted mb-2" />
                <div className="h-4 w-full rounded bg-muted" />
              </div>
            ))
          ) : (
            items.map((item, index) => (
              <motion.div
                key={item.slug}
                initial={mounted ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                className="group p-6 rounded-2xl bg-background/60 backdrop-blur-md border border-border hover:border-emerald-500/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                    <Briefcase size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-1">
                      <h3 className="text-xl font-bold group-hover:text-emerald-500 transition-colors">
                        {item.role}
                      </h3>
                      {item.period && (
                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                          {item.period}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      {item.company}
                      {item.location && (
                        <span className="inline-flex items-center gap-1 text-muted-foreground font-normal">
                          <MapPin size={12} />
                          {item.location}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                {item.description && (
                  <div className="text-sm text-muted-foreground leading-relaxed mt-4">
                    {renderDescription(item.description)}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
