"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  ArrowUpRight,
  Github,
  Linkedin,
  Instagram,
} from "lucide-react";
import { getSiteSettings, DEFAULT_SETTINGS } from "@/lib/settings";

export default function Contact() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    (async () => {
      setSettings(await getSiteSettings());
    })();
  }, []);

  const rows = [
    {
      label: "Email",
      value: settings.contact_email,
      href: `mailto:${settings.contact_email}`,
      Icon: Mail,
      external: false,
    },
    {
      label: "GitHub",
      value: "github",
      href: settings.social_github,
      Icon: Github,
      external: true,
    },
    {
      label: "LinkedIn",
      value: "linkedin",
      href: settings.social_linkedin,
      Icon: Linkedin,
      external: true,
    },
    {
      label: "Instagram",
      value: "instagram",
      href: settings.social_instagram,
      Icon: Instagram,
      external: true,
    },
  ];

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16">
        <div className="lg:sticky lg:top-28 self-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Contact
            </p>
            <h2 className="md:text-7xl font-medium tracking-tight leading-[1.05] mb-6">
              Let&apos;s Build Something NEW.
            </h2>
            <p
              className="text-muted-foreground text-lg leading-relaxed mb-8"
              dangerouslySetInnerHTML={{ __html: settings.contact_intro }}
            />
            <div className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-7 py-3.5 text-sm font-medium">
              <MapPin size={16} />
              {settings.location_city} • {settings.location_mode}
            </div>
          </motion.div>
        </div>

        <div>
          {rows.map((row, index) => {
            const inner = (
              <>
                <div className="flex items-center gap-4">
                  <span className="p-2.5 rounded-xl text-foreground shrink-0">
                    <row.Icon size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      {row.label}
                    </p>
                    <p className="font-medium">{row.href.replace(/^(https?:\/\/|mailto:)/, '')}</p>
                  </div>
                </div>
                {row.href && (
                  <span className="p-2 rounded-full group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all shrink-0">
                    <ArrowUpRight size={16} />
                  </span>
                )}
              </>
            );

            const classes =
              "group flex items-center justify-between gap-4 py-6 transition-colors " +
              (row.href ? "hover:bg-muted/40 px-2 -mx-2 rounded-xl" : "px-2 -mx-2");

            return (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                {row.href ? (
                  <a
                    href={row.href}
                    target={row.external ? "_blank" : undefined}
                    rel={row.external ? "noopener noreferrer" : undefined}
                    className={classes}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className={classes}>{inner}</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
