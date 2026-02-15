"use client";

import { motion } from "framer-motion";
import { Github, Lock, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface Project {
  title: string;
  client: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
}

export default function Projects() {
  const projects: Project[] = [
    {
      title: "Trace Bean",
      client: "Lisk Builder Challenge: Round 3",
      description: "Decentralize Supply Chain Coffee Bean Management.",
      image: "/projects/trace-bean.png",
      tags: [
        "Web3",
        "Solidity",
        "Smart Contract",
        "NextJs",
        "Ponder",
        "PostgreSQL",
        "IPFS",
      ],
      github: "#",
    },
    {
      title: "E-Kanban Warehouse System",
      client: "PT. Denso Manufacturing Indonesia",
      description: "Migrate Existing Kanban System from EOL Xamarin to Kotlin.",
      image: "/projects/ekanban.png",
      tags: ["Kotlin", "Xamarin", "MsSQL"],
      github: "#",
    },
    {
      title: "PBA Lend",
      client: "Pelita Bangsa Academy",
      description: "Decentralize Lending And Borrowing Application Bootcamp",
      image: "/projects/pbalend.png",
      tags: [
        "Web3",
        "Solidity",
        "Smart Contract",
        "NextJs",
        "Ponder",
        "PostgreSQL",
      ],
      github: "#",
    },
    {
      title: "Barcode Gas System",
      client: "PT. Iwatani Industrial Gas Indonesia",
      description:
        "Create Production, Quality Control, and Maintenance Android Applications.",
      image: "/projects/iigi.png",
      tags: ["PHP", "Code Igniter", "Javascript", "MsSQL"],
      github: "#",
    },
    {
      title: "Overall Equipment Effectiveness",
      client: "Internal Project",
      description:
        "Building a web application to track and improve Overall Effectiveness Equipment (OEE) for better operational efficiency.",
      image: "/projects/bit-oee.png",
      tags: ["Go", "Javascript", "Vue.js", "MsSQL", "Centrifugo"],
      github: "#",
    },
    {
      title: "Wireless Button Control",
      client: "PT. Mitsubishi Krama Yudha Motors & Manufacturing",
      description:
        "Developing a custom wireless button with ESP32, integrated into existing systems to enhance usability and improve operational workflow.",
      image: "/projects/mkm-button.png",
      tags: ["C++", "Arduino", "MQTT"],
      github: "#",
    },
    {
      title: "IoT Dashboard",
      client: "PT. Denso Manufacturing Indonesia",
      description:
        "Supported expansion of existing IoT dashboard to additional production line and coordinated requirements gathering and stakeholder communication.",
      image: "/projects/tbc.png",
      tags: ["Go", "PHP", "MsSQL"],
      github: "#",
    },
    {
      title: "PLC Data Monitoring & Reporting",
      client: "PT. Bintang Toedjoe",
      description:
        "Built a web system to read PLC data, calculate machine performance, store to database, and display real-time data with interactive reports.",
      image: "/projects/fbd.png",
      tags: ["Go", "Javascript", "Vue.js", "MsSQL"],
      github: "#",
    },
    {
      title: "Process Performance",
      client: "PT. Yasulor Indonesia (L'Oreal Indonesia Plant)",
      description: "Enhanced Process Performance Indicator System.",
      image: "/projects/tbc.png",
      tags: ["PHP", "Code Igniter", "Javascript", "MsSQL"],
      github: "#",
    },
    {
      title: "Waste Management System",
      client: "PT. Yasulor Indonesia (L'Oreal Indonesia Plant)",
      description: "Developing Waste Management System.",
      image: "/projects/tbc.png",
      tags: ["Go", "Javascript", "Vue.js", "MsSQL"],
      github: "#",
    },
    {
      title: "PLC Integrator",
      client: "PT. Bintang Toedjoe",
      description:
        "Integrate MicroNIR App and Siemens S7-300 PLC into one App.",
      image: "/projects/pat.png",
      tags: ["Go", "Javascript", "Vue.js"],
      github: "#",
    },
    {
      title: "UHF RFID PPE Identification System",
      client: "Personal & College Project",
      description:
        "Developed a final project using UHF RFID to track personal protective equipment.",
      image: "/projects/uhf-rfid.png",
      tags: ["C++", "Arduino"],
      github: "https://github.com/anharfhdn/Project-UHF-RFID",
    },
    {
      title: "Arduino-Based IC Tester",
      client: "Personal & College Project",
      description:
        "Developed a digital logic gate tester with Arduino to verify ICs for AND, OR, NAND, and NOR functionality.",
      image: "/projects/ic-tester.png",
      tags: ["C++", "Arduino"],
      github: "https://github.com/anharfhdn/Arduino-Logic-Gates-Tester",
    },
  ];

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
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group flex flex-col bg-background/60 backdrop-blur-md
                                     border border-emerald-500/20 rounded-2xl overflow-hidden
                                     hover:border-emerald-500/60 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]
                                     transition-all duration-500 relative"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1"
                />
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
          ))}
        </div>
      </div>
    </section>
  );
}
