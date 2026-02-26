"use client";

import { useEffect, useState, useRef } from "react";
import { getBlogPostBySlug } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import Link from "next/link";
import { marked } from "marked";
import hljs from "highlight.js";
import katex from "katex";
import "katex/dist/katex.min.css";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [post, setPost] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    params.then(async ({ slug: paramSlug }) => {
      const foundPost = await getBlogPostBySlug(paramSlug);
      setPost(foundPost);
      setMounted(true);
    });
  }, [params]);

  useEffect(() => {
    marked.setOptions({
      gfm: true,
      breaks: true,
    });
  }, []);

  useEffect(() => {
    if (mounted && post && contentRef.current) {
      const codeBlocks = contentRef.current.querySelectorAll("pre code");
      codeBlocks.forEach((block) => {
        block.removeAttribute("data-highlighted");
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [mounted, post]);

  useEffect(() => {
    if (mounted && post && contentRef.current) {
      const preBlocks = contentRef.current.querySelectorAll("pre");

      preBlocks.forEach((pre) => {
        const code = pre.querySelector("code");
        if (!code) return;

        code.removeAttribute("data-highlighted");
        hljs.highlightElement(code as HTMLElement);

        if (!pre.querySelector(".copy-code-button")) {
          const button = document.createElement("button");
          button.className = "copy-code-button";
          button.setAttribute("aria-label", "Copy code");
          button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          `;

          button.onclick = async () => {
            await navigator.clipboard.writeText(code.innerText);
            button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
            button.classList.add("copied");

            setTimeout(() => {
              button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
              button.classList.remove("copied");
            }, 2000);
          };

          pre.appendChild(button);
        }
      });
    }
  }, [mounted, post]);

  if (!mounted) return null;
  if (!post) notFound();

  const renderContent = () => {
    const rawContent = post.markdown || post.content || "";
    let html = marked.parse(rawContent) as string;

    return html.replace(/\$([^$]+)\$/g, (_, equation) => {
      try {
        const unescapedEquation = equation
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&");

        return katex.renderToString(unescapedEquation, {
          throwOnError: false,
          displayMode: false,
        });
      } catch (err) {
        return equation;
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-24 grid-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          <article>
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                  {post.category || "Uncategorized"}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                {post.title}
              </h1>
              <h2 className="text-xl md:text-2xl italic tracking-tight mb-8">
                {post.excerpt}
              </h2>

              <div className="flex flex-wrap items-center justify-between gap-6 text-sm text-muted-foreground border-y border-border py-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <User size={16} /> {post.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} /> {post.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} /> {post.readTime}
                  </div>
                </div>
                <ShareButton label={post.title} />
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-12 border border-border shadow-xl">
              <Image
                src={post.image}
                alt={post.alt || ""}
                fill
                className="object-cover"
              />
            </div>

            <div
              ref={contentRef}
              className="prose prose-lg md:prose-xl dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-p:text-stone-700 dark:prose-p:text-stone-300 prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderContent() }}
            />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
