"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Philosophy() {
  const philosophyPoints = [
    {
      title: "Everything in One, Guided by Light",
      desc: "My initials (A and F) are formed by the falling star - a symbol of hope and aspiration, like wishes made under the night sky. All my skills and experiences move together with purpose, guided by light. The five smaller stars keep me connected, grateful, and intentional.",
    },
    {
      title: "Always Reaching",
      desc: "The upward arrow reminds me that growth is a choice I make every day - my path points toward progress.",
    },
    {
      title: "Stay Focused",
      desc: "The sharp point cuts through distractions. It's my commitment to clarity, to pursuing what truly matters.",
    },
    {
      title: "Stronger from Stress",
      desc: "The two letters lean into each other, creating something stronger than either could be alone. When pressure comes, I don't stand isolated - I find strength in connection and unity.",
    },
    {
      title: "Stay Grounded",
      desc: "The even sides create equilibrium. This shape reminds me that balance between career and life isn't a luxury - it's essential. When I'm balanced, stress dissolves, and I can see clearly again.",
    },
  ];

  return (
    <section id="philosophy" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-square max-w-[500px] mx-auto lg:mx-0"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Philosophy
            </p>
            <h2 className="md:text-7xl font-medium tracking-tight mb-8 leading-[1.05]">
              Identity. Alignment. Ascent.
            </h2>
            <div className="relative h-full w-full rounded-3xl overflow-hidden">
              <Image
                src="/philosophy.png"
                alt="AF Arrow Philosophy"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-8">
              {philosophyPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h4 className="font-bold text-lg italic mb-1">{point.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {point.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-xl font-medium italic">
                "Who I am. How I work. Where I'm going."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
