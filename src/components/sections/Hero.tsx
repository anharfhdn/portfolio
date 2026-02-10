"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  Download,
  Code,
  Database,
  LocationEdit,
} from "lucide-react";
import Link from "next/link";
import ResumeButton from "@/components/ui/ResumeButton";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center grid-bg bg-emerald-50/30 dark:bg-emerald-950/10 overflow-hidden pt-16">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest text-emerald-600 uppercase bg-emerald-500/10 rounded-full mb-6">
            🌏 Open to Remote/Onsite • Full-Stack + Blockchain Developer
          </span>

          <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
            <span className="text-muted-foreground italic font-light">
              ENGINEERING
            </span>
            <br />
            SCALABLE SYSTEMS
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed">
            <strong>Full-stack software engineer</strong> with a backend focus
            and <strong>3+ years</strong> of experience building
            production-grade{" "}
            <strong>industrial automation, IoT, and data-driven systems</strong>
            . <br />
            <br />
            Building on an intensive <strong>Blockchain Developer</strong>{" "}
            bootcamp foundation, currently deep-diving into the{" "}
            <strong>Web3 ecosystem</strong>—advancing expertise in{" "}
            <strong>Solidity, EVM, Rust, Smart Contracts</strong>, and{" "}
            <strong>DeFi protocols</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#projects"
              className="group flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-background px-8 py-4 rounded-full font-medium transition-transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
            >
              <Code size={18} />
              View Projects
              <ArrowRight
                className="group-hover:translate-x-1 transition-transform"
                size={18}
              />
            </Link>

            <ResumeButton />

            <Link
              href="/#contact"
              className="group flex items-center gap-2 px-8 py-4 rounded-full border-2 border-emerald-500/30 font-medium hover:bg-emerald-500/10 hover:text-emerald-600 transition-all hover:scale-105"
            >
              <Mail size={18} />
              Contact Me
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
