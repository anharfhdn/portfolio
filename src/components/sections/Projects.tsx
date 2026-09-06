"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Lock, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { getAllProjects } from "@/lib/projects";
import { TechIcon } from "@/components/tech-icons";

interface Project {
  slug: string;
  title: string;
  client: string;
  description: string;
  image: string;
  tags: string[];
  tag_icons: string[];
  github: string;
}

const SKELETON_COUNT = 6;

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
          tag_icons: p.tag_icons || [],
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
    <section id="projects" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Projects
          </p>
          <h2 className="md:text-7xl font-medium tracking-tight mb-6 leading-[1.05]">
            Selected Work
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            A documented history of production-grade software across Industrial IoT and Web3 ecosystems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loaded ? (
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="flex flex-col bg-card border border-border rounded-3xl overflow-hidden animate-pulse"
              >
                <div className="aspect-[16/9] bg-muted" />
                <div className="p-6 space-y-4">
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
              className="group flex flex-col bg-muted/50 rounded-3xl overflow-hidden hover:border-emerald-500/60 hover:shadow-lg transition-all duration-300 relative"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">
                      No Image
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, i) =>
                    project.tag_icons[i] ? (
                      <span
                        key={`${tag}-${i}`}
                        title={tag}
                        className="text-foreground p-1.5 rounded-lg"
                      >
                        <TechIcon icon={project.tag_icons[i]} size={16} />
                      </span>
                    ) : null,
                  )}
                </div>

                <h3 className="text-xl font-medium mb-1">
                  {project.title}
                </h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
                  {project.client}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-8 flex-1 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex items-center justify-between pt-5 border-t border-border">
                  {project.github === "#" ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Lock size={12} />
                      <span className="uppercase tracking-widest">
                        Enterprise Protected
                      </span>
                    </div>
                  ) : (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-medium hover:text-muted-foreground transition-colors uppercase tracking-widest"
                    >
                      <Github size={14} /> Source Code
                    </a>
                  )}

                  <button
                    onClick={() => handleProjectClick(project)}
                    className="p-2 rounded-full group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all shrink-0"
                    aria-label={`Open ${project.title}`}
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
