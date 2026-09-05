"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, Loader2, Lock } from "lucide-react";

interface ResumeButtonProps {
  className?: string;
}

const RESUME_HREF = "/resume.pdf";
const RESUME_FILENAME = "Resume-Anhar.pdf";

export default function ResumeButton({ className = "" }: ResumeButtonProps) {
  const [checking, setChecking] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    if (checking) return;
    setChecking(true);
    try {
      const res = await fetch(RESUME_HREF, { method: "HEAD" });
      if (!res.ok) {
        toast("Coming Soon", {
          description: "Download resume still in progress!",
          icon: <Lock size={16} className="text-emerald-500" />,
        });
        return;
      }
      const a = document.createElement("a");
      a.href = RESUME_HREF;
      a.download = RESUME_FILENAME;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast("Resume Downloaded", {
        description: "Check your downloads!",
        icon: <Download size={16} className="text-emerald-500" />,
      });
    } catch {
      toast("Coming Soon", {
        description: "Download resume still in progress!",
        icon: <Lock size={16} className="text-emerald-500" />,
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <a
      href={RESUME_HREF}
      download={RESUME_FILENAME}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-disabled={checking}
      className={`group flex items-center gap-2 bg-gradient-to-r from-emerald-400/90 via-emerald-500/80 to-green-500/80 hover:from-emerald-500 hover:via-emerald-600 hover:to-green-600 text-background px-8 py-4 rounded-full font-medium transition-all hover:scale-105 hover:shadow-emerald-500/30 ${className}`}
    >
      {checking ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <Download
          className="group-hover:translate-x-1 transition-transform"
          size={18}
        />
      )}
      View Resume
    </a>
  );
}
