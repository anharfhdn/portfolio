"use client";

import { useState, useEffect, useRef } from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import {
  Eye,
  Edit3,
  Code,
  Save,
  Copy,
  Download,
  FileText,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface MarkdownEditorProps {
  initialContent?: string;
  onSave?: (content: string | undefined) => void | Promise<void>;
  readOnly?: boolean;
}

export default function MarkdownEditor({
  initialContent = "",
  onSave,
  readOnly = false,
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [mode, setMode] = useState<"edit" | "preview" | "split">("split");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    marked.setOptions({
      gfm: true,
      breaks: true,
    });
  }, []);

  useEffect(() => {
    if ((mode === "preview" || mode === "split") && previewRef.current) {
      const codeBlocks = previewRef.current.querySelectorAll("pre code");
      codeBlocks.forEach((block) => {
        block.removeAttribute("data-highlighted");
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [content, mode]);

  const renderMarkdown = (markdown: string): string => {
    try {
      return marked.parse(markdown) as string;
    } catch (error) {
      return "Error rendering markdown";
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const previewArea = document.querySelector(".markdown-body");
      if (previewArea) {
        previewArea.querySelectorAll("pre code").forEach((block) => {
          hljs.highlightElement(block as HTMLElement);
        });
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [content, mode]);

  const handleSave = async () => {
    setIsSaving(true);
    if (onSave) {
      try {
        await onSave(content);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCopy = async () => {
    if (typeof content === "string") {
      await navigator.clipboard.writeText(content);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blog-post-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`relative bg-gradient-to-br from-stone-50 via-amber-50/30 to-green-50/20 dark:from-zinc-950 dark:via-stone-950 dark:to-neutral-950 rounded-2xl border-2 border-stone-200/60 dark:border-stone-800/60 rounded overflow-hidden transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-green-500 to-red-500" />

      <div className="relative bg-background border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <button
              onClick={() => setMode("edit")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                mode === "edit"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              disabled={readOnly}
            >
              <Edit3 size={14} />
              Edit
            </button>
            <button
              onClick={() => setMode("split")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                mode === "split"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Code size={14} />
              Split
            </button>
            <button
              onClick={() => setMode("preview")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                mode === "preview"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye size={14} />
              Preview
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
              title="Copy markdown"
            >
              {copied ? (
                <>
                  <FileText size={16} className="text-emerald-500" />
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
              title="Download markdown"
            >
              <Download size={16} />
              Download
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save
                </>
              )}
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          className={`grid ${
            mode === "split" ? "grid-cols-2" : "grid-cols-1"
          } ${isFullscreen ? "h-[calc(100vh-73px)]" : "h-[600px]"}`}
        >
          {(mode === "edit" || mode === "split") && (
            <div className="relative border-r border-stone-200/60 dark:border-stone-800/60 bg-white dark:bg-stone-950">
              <div className="absolute top-4 left-6 text-xs font-bold tracking-widest uppercase text-stone-400 dark:text-stone-600">
                Markdown
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                readOnly={readOnly}
                className="w-full h-full pt-12 px-6 pb-6 bg-transparent text-stone-800 dark:text-stone-200 font-mono text-sm leading-relaxed resize-none focus:outline-none"
                placeholder="# Start writing your blog post here...\n\n## Introduction\n\nWrite content in Markdown format.\n\n- Lists work great\n- Easy formatting\n- Beautiful preview\n\n**Bold text** and *italic text* are simple."
                spellCheck={false}
              />
            </div>
          )}

          {(mode === "preview" || mode === "split") && (
            <div className="relative overflow-y-auto bg-gradient-to-br from-white via-stone-50/50 to-amber-50/30 dark:from-stone-950 dark:via-stone-900 dark:to-neutral-950">
              <div className="absolute top-4 left-6 text-xs font-bold tracking-widest uppercase text-stone-400 dark:text-stone-600">
                Preview
              </div>
              <div
                className="markdown-body prose prose-stone dark:prose-invert max-w-none text-left pt-12 px-6 pb-12"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(content || "*No content to preview*"),
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-30" />
    </div>
  );
}
