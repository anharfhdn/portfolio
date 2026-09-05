"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Lock, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { getAllProjects } from "@/lib/projects";

interface Project {
  slug: string;
  title: string;
  client: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    (async () => {
      const all = await getAllProjects();
      setProjects(
        all.map((p) => ({
          slug: p.slug,
          title: p.title,
          client: p.client || "",
          description: p.description || "",
          image: p.image || "",
          tags: p.tags || [],
          github: p.confidential ? "#" : p.link || "#",
        })),
      );
      setLoaded(true);
    })();
  }, []);

  const handleProjectClick = (project: Project) => {
    if (project.github === "#") {
      toast.info("Confidential Project", {
        description: "Source code is protected by an NDA with the client.",
        icon: <Lock size={16} className="text-emerald-500" />,
      });
    } else {
      window.open(project.github, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section
      id="projects"
      className="py-32 relative grid-bg bg-emerald-50/30 dark:bg-emerald-950/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-600 font-mono text-[10px] tracking-[0.3em] uppercase">
                Projects
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              SELECTED <br />
              <span className="text-emerald-500 italic font-light text-5xl md:text-6xl">
                PROJECTS
              </span>
            </h2>
          </div>

          <div className="hidden lg:flex flex-1 mx-12 mb-4 self-end">
            <div className="relative h-[1px] w-full bg-emerald-500/10">
              <div className="absolute top-0 left-0 h-full w-2/3 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent animate-pulse" />
            </div>
          </div>

          <div className="relative">
            <p className="text-muted-foreground text-xs md:text-sm font-medium max-w-[260px] leading-relaxed border-l-2 border-emerald-500/20 pl-4 py-1">
              A documented history of{" "}
              <span className="text-foreground">production-grade</span> software
              across Industrial IoT and Web3 ecosystems.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loaded ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="flex flex-col bg-background/60 border border-emerald-500/20 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="aspect-[16/9] bg-muted" />
                <div className="p-7 space-y-4">
                  <div className="h-4 w-2/3 rounded bg-muted" />
                  <div className="h-6 w-full rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-5/6 rounded bg-muted" />
                </div>
              </div>
            ))
          ) : projects.length === 0 ? (
            <p className="text-muted-foreground col-span-full text-center py-12">
              No projects published yet.
            </p>
          ) : (
            projects.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={mounted ? { opacity: 0, y: 20 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group flex flex-col bg-background/60 backdrop-blur-md
                                     border border-emerald-500/20 rounded-2xl overflow-hidden
                                     hover:border-emerald-500/60 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]
                                     transition-all duration-500 relative"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/30 flex items-center justify-center">
                    <span className="text-emerald-600 font-mono text-sm">
                      No Image
                    </span>
                  </div>
                )}
              </div>

              <div className="p-7 flex flex-col flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-2xl font-bold mb-1 group-hover:text-emerald-500 transition-colors">
                  {project.title}
                </h3>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">
                  For:{" "}
                  <span className="text-foreground font-bold">
                    {project.client}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-8 flex-1 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex items-center justify-between pt-5 border-t border-emerald-500/10">
                  {project.github === "#" ? (
                    <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60">
                      <Lock size={12} className="text-emerald-500/40" />
                      <span className="uppercase tracking-tighter">
                        Enterprise Protected
                      </span>
                    </div>
                  ) : (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[10px] font-mono font-bold hover:text-emerald-500 transition-colors uppercase tracking-tighter"
                    >
                      <Github size={14} /> Source Code
                    </a>
                  )}

                  <button
                    onClick={() => handleProjectClick(project)}
                    className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm active:scale-95"
                  >
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
