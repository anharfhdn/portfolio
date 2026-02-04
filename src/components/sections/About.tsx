"use client";

import { motion } from "framer-motion";
import { Cpu, ShieldCheck, Database, Globe } from "lucide-react";

export default function About() {
    const coreStack = [

        {
            name: "Web3 & Blockchain",
            icon: <ShieldCheck size={20} />,
            description: "Secure smart contracts, gas optimization, and EVM-compatible protocols."
        },
        {
            name: "Backend Architecture",
            icon: <Database size={20} />,
            description: "Scalable schemas, system integration, and high-performance APIs for B2B."
        },
        {
            name: "Frontend & Mobile",
            icon: <Globe size={20} />,
            description: "Modern web applications and mobile interfaces with Vue, Next.js, and Kotlin."
        },
        {
            name: "Industrial & IoT",
            icon: <Cpu size={20} />,
            description: "Production automation and hardware-to-cloud integration using PLC and ESP32."
        }
    ];

    const technicalSkills = [
        {
            category: "Blockchain & Web3",
            items: "Solidity, EVM, Smart Contracts, Foundry, DeFi, NFT, Gas Optimization, IPFS"
        },
        {
            category: "Backend (BE)",
            items: "Go, PHP, JavaScript, Kotlin, PostgreSQL, MySQL, MSSQL, CodeIgniter"
        },
        {
            category: "Frontend (FE) & Mobile",
            items: "JavaScript, Next.js, Vue.js, Kotlin, JQuery, Web Applications"
        },
        {
            category: "Systems & IoT",
            items: "C, C++, Arduino C++, ESP32, ESP8266, Programmable Logic Controller, Git, Linux, Postman"
        },
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
                        <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                            BRIDGING SYSTEMS <br />
                            <span className="text-emerald-500 italic font-light text-5xl md:text-6xl">WITH CODE</span>
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
                                className="group p-6 rounded-2xl bg-gradient-to-br from-secondary/20 to-transparent border border-border hover:border-emerald-500/40 hover:bg-secondary/30 transition-all flex gap-5 items-start relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 group-hover:bg-emerald-500/10 transition-colors" />

                                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 z-10">
                                    {skill.icon}
                                </div>

                                <div className="z-10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold">{skill.name}</h3>
                                        <span className="h-px w-8 bg-emerald-500/30 hidden group-hover:block animate-in slide-in-from-left-2" />
                                    </div>

                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {skill.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}