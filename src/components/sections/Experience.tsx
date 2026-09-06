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
    <section id="experience" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Experience
            </p>
          </motion.div>

          <h2 className="md:text-7xl font-medium tracking-tight leading-[1.05]">
            Work History
          </h2>
        </div>

        <div className="space-y-6">
          {!loaded ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="p-6 rounded-3xl bg-card animate-pulse"
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
                transition={{ duration: 0.5, delay: 0.05 * (index + 1) }}
                className="group p-6 md:p-8 rounded-3xl bg-muted/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-muted text-foreground shrink-0">
                    <Briefcase size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-1">
                      <h3 className="text-xl font-medium">
                        {item.role}
                      </h3>
                      {item.period && (
                        <span className="text-xs text-muted-foreground uppercase tracking-widest">
                          {item.period}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
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
