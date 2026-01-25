"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, ArrowUpRight, Globe, Database, ShieldCheck } from "lucide-react";

export default function Contact() {
    return (
        <section id="contact" className="py-24 relative grid-bg bg-emerald-50/30 dark:bg-emerald-950/10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    <div className="lg:w-1/3">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-emerald-600 font-mono text-[10px] tracking-[0.3em] uppercase">
                                Contact
                            </span>
                        </div>
                        <h2 className="text-5xl font-black tracking-tighter mb-6">
                            LET'S BUILD <br />
                            <span className="text-muted-foreground italic font-light">SOMETHING NEW.</span>
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                            Always looking for challenges in <strong>Industrial IoT architecture</strong> or
                            collaborating on <strong>Web3 protocols</strong>. Based in Indonesia, working worldwide.
                        </p>
                    </div>

                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

                        <motion.a
                            href="mailto:anharfahrudin21@gmail.com"
                            whileHover={{ y: -5 }}
                            className="md:col-span-2 p-8 rounded-3xl bg-secondary/50 border border-border hover:border-emerald-500/50 transition-all group flex justify-between items-center"
                        >
                            <div>
                                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Primary Contact</p>
                                <h3 className="text-2xl font-bold group-hover:text-emerald-500 transition-colors">anharfahrudin21@gmail.com</h3>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center group-hover:rotate-45 transition-transform">
                                <ArrowUpRight className="text-emerald-500" />
                            </div>
                        </motion.a>

                        <div className="p-8 rounded-3xl bg-secondary/30 border border-border flex flex-col justify-between min-h-[160px]">
                            <MapPin className="text-emerald-500 mb-4" size={24} />
                            <div>
                                <h3 className="font-bold text-xl">Bogor, ID</h3>
                                <p className="text-sm text-muted-foreground uppercase tracking-tighter">Remote / Onsite</p>
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl bg-emerald-500 text-white flex flex-col justify-between min-h-[160px]">
                            <div className="flex justify-between items-start">
                                <Database size={24} />
                                <span className="text-[10px] font-mono border border-white/30 px-2 py-1 rounded-full uppercase">Current Focus</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-xl leading-tight">Industrial IoT & Solidity Architecture</h3>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}