"use client";

import { toast } from "sonner";
import { Download, Lock, Wallet, Computer } from "lucide-react";
import Link from "next/link";
import { useAccount } from "wagmi";

interface ResumeButtonProps {
  className?: string;
}

export default function ResumeButton({ className = "" }: ResumeButtonProps) {
  const { isConnected, address } = useAccount();

  const handleResumeDownload = (e: React.MouseEvent) => {
    e.preventDefault();

    if (typeof window !== "undefined" && window.innerWidth < 768) {
      toast("Desktop Recommended", {
        description: "Open on desktop for full wallet experience!",
        icon: <Computer size={16} className="text-emerald-500" />,
      });
      return;
    }

    if (!isConnected) {
      toast("Wallet Required", {
        description: "Connect your wallet to download resume!",
        icon: <Wallet size={16} className="text-emerald-500" />,
      });
      return;
    }

    if (true) {
      toast("Coming Soon", {
        description: "Download resume still in progress!",
        icon: <Lock size={16} className="text-emerald-500" />,
      });
      return;
    }

    toast("Resume Downloaded", {
      description: `Check your downloads, ${address?.slice(0, 6)}...!`,
      icon: <Download size={16} className="text-emerald-500" />,
    });

    window.open("/resume.pdf", "_blank");
  };

  return (
    <Link
      href="#"
      onClick={handleResumeDownload}
      className="group flex items-center gap-2 bg-gradient-to-r from-emerald-400/90 via-emerald-500/80 to-green-500/80 hover:from-emerald-500 hover:via-emerald-600 hover:to-green-600 text-background px-8 py-4 rounded-full font-medium transition-all hover:scale-105 hover:shadow-emerald-500/30"
    >
      <Download
        className="group-hover:translate-x-1 transition-transform"
        size={18}
      />
      View Resume
    </Link>
  );
}
