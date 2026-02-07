"use client";

import { useEffect, useState } from "react";
import { getBlogPostBySlug } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import Link from "next/link";
import { marked } from "marked";

export default function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const [post, setPost] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

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

    if (!mounted) {
        return null;
    }

    if (!post) {
        notFound();
    }

    const renderContent = () => {
        if (post.markdown) {
            try {
                return marked.parse(post.markdown, { async: false }) as string;
            } catch (error) {
                console.error('Error rendering markdown:', error);
                return post.content || '';
            }
        }
        return post.content || '';
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 pb-24 grid-bg">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-12"
                    >
                        <ArrowLeft size={16} /> Back to Blog
                    </Link>

                    <article>
                        <div className="mb-12">
                            <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary rounded-full mb-6">
                                {post.category}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
                                {post.title}
                            </h1>

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

                                <div className="flex items-center gap-2">
                                    <ShareButton label={post.title} />
                                </div>
                            </div>
                        </div>

                        <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-12 border border-border">
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div
                            className="prose prose-lg dark:prose-invert max-w-none
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
