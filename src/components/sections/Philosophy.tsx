"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Philosophy() {
    const philosophyPoints = [
        {
            "title": "Everything in One, Guided by Light",
            "desc": "My initials (A and F) are formed by the falling star - a symbol of hope and aspiration, like wishes made under the night sky. All my skills and experiences move together with purpose, guided by light. The five smaller stars keep me connected, grateful, and intentional."
        },
        {
            "title": "Always Reaching",
            "desc": "The upward arrow reminds me that growth is a choice I make every day - my path points toward progress."
        },
        {
            "title": "Stay Focused",
            "desc": "The sharp point cuts through distractions. It's my commitment to clarity, to pursuing what truly matters."
        },
        {
            "title": "Stronger from Stress",
            "desc": "The two letters lean into each other, creating something stronger than either could be alone. When pressure comes, I don't stand isolated - I find strength in connection and unity."
        },
        {
            "title": "Stay Grounded",
            "desc": "The even sides create equilibrium. This shape reminds me that balance between career and life isn't a luxury - it's essential. When I'm balanced, stress dissolves, and I can see clearly again."
        }
    ];

    return (
        <section id="philosophy" className="py-32 relative grid-bg bg-emerald-50/30 dark:bg-emerald-950/10">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative aspect-square max-w-[500px] mx-auto lg:mx-0 group"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-emerald-600 font-mono text-xs uppercase tracking-widest">
                                Philosophy
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                            IDENTITY. ALIGNMENT. <br />
                            <span className="text-emerald-500 italic font-light text-5xl md:text-6xl">ASCENT.</span>
                        </h2>
                        <div className="absolute inset-0 bg-emerald-500/5 rounded-3xl -rotate-3 group-hover:rotate-0 transition-transform duration-500" />
                        <div className="relative h-full w-full rounded-3xl overflow-hidden border border-emerald-500/20 shadow-2xl">
                            <Image
                                src="/philosophy.png"
                                alt="AF Arrow Philosophy"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
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
                                    className="relative pl-6 border-l border-emerald-500/20"
                                >
                                    <div className="absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-emerald-500" />
                                    <h4 className="font-bold text-lg mb-1">{point.title}</h4>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {point.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-border">
                            <p className="text-xl font-medium italic text-emerald-600">
                                "Who I am. How I work. Where I'm going."
                            </p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}