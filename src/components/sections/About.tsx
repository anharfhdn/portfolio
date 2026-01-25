"use client";

import { motion } from "framer-motion";
import { Cpu, ShieldCheck, Database, Code2, Terminal, Globe } from "lucide-react";

export default function About() {
    const coreStack = [
        {
            name: "Industrial & IoT",
            icon: <Cpu size={20} />,
            description: "Production automation and data-driven backend systems."
        },
        {
            name: "Backend Architecture",
            icon: <Database size={20} />,
            description: "Scalable schemas and high-performance APIs for B2B."
        },
        {
            name: "Web3 & Blockchain",
            icon: <ShieldCheck size={20} />,
            description: "Secure smart contracts and EVM-compatible protocols."
        },
    ];

    const technicalSkills = [
        { category: "Languages", items: "TypeScript, JavaScript, Python, Go, Solidity" },
        { category: "Frameworks", items: "React, Next.js, Node.js, Express, Hardhat" },
        { category: "Infrastructure", items: "PostgreSQL, Prisma, Supabase, Docker, MQTT" },
    ];

    return (
        <section id="about" className="py-24 relative grid-bg bg-emerald-50/30 dark:bg-emerald-950/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

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
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">
                            BRIDGING <span className="text-emerald-500 italic font-light">SYSTEMS</span> <br />
                            WITH CODE
                        </h2>

                        <div className="space-y-4 text-lg text-muted-foreground leading-relaxed mb-10">
                            <p>
                                Engineering robust software at the intersection of <strong>Industrial Automation</strong> and <strong>Decentralized Protocols</strong>. Focused on creating systems where reliability and data integrity are non-negotiable.
                            </p>
                            <p>
                                Leveraging <strong>3+ years</strong> of full-stack experience to build applications that translate complex industrial requirements into elegant, scalable technical solutions.
                            </p>
                        </div>

                        <div className="space-y-6 border-l-2 border-emerald-500/20 pl-6 mb-10">
                            {technicalSkills.map((skill) => (
                                <div key={skill.category}>
                                    <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-600 mb-2">{skill.category}</h4>
                                    <p className="text-foreground font-medium">{skill.items}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-2xl bg-secondary/30 border border-border">
                                <h3 className="text-3xl font-bold mb-1">3+</h3>
                                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Years Industry Exp.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-emerald-500 text-white border border-emerald-400">
                                <h3 className="text-3xl font-bold mb-1 italic">Web3</h3>
                                <p className="text-[10px] font-mono uppercase tracking-widest opacity-80">Active Expansion</p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="space-y-4">

                        {coreStack.map((skill, index) => (
                            <motion.div
                                key={skill.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-6 rounded-2xl bg-secondary/20 border border-border hover:border-emerald-500/30 transition-all flex gap-5 items-start"
                            >
                                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    {skill.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">{skill.name}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{skill.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}