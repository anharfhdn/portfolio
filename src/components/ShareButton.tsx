"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";

export default function ShareButton({ label }: { label?: string }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        try {
            const url = typeof window !== "undefined" ? window.location.href : "";
            await navigator.clipboard.writeText(url);
            setCopied(true);

            toast(label ? `${label} — link copied` : "Link copied", {
                description: "Post URL copied to clipboard",
                icon: (<Share2 size={16} className="text-emerald-500" />) as React.ReactNode,
            });

            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast("Failed to copy link", {
                description: "Could not access clipboard",
            });
        }
    };

    return (
        <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-muted/50 hover:bg-muted transition-colors text-sm"
        >
            {copied ? <Check size={14} /> : <Share2 size={14} />}
            <span>{copied ? "Copied" : "Share"}</span>
        </button>
    );
}
