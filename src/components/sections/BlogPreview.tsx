"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function BlogPreview() {
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            const allPosts = await getAllBlogPosts();
            const sortedPosts = allPosts.sort((a, b) => {
                const dateA = new Date(a.date || '1970-01-01');
                const dateB = new Date(b.date || '1970-01-01');
                return dateB.getTime() - dateA.getTime();
            });
            setPosts(sortedPosts.slice(0, 3) as any[]);
        })();
    }, []);

    if (typeof window === 'undefined') {
        return null;
    }

    const featuredPosts = posts;

    return (
        <section id="blog" className="py-24 relative grid-bg bg-emerald-50/30 dark:bg-emerald-950/10">
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-2 mb-4"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-emerald-600 font-mono text-[10px] tracking-[0.3em] uppercase">
                            Blog
                        </span>
                    </motion.div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">                        
                        <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                            LATEST <br />
                            <span className="text-emerald-500 italic font-light text-5xl md:text-6xl">BLOG</span>
                        </h2>

                        <div className="hidden lg:flex flex-1 mx-12 mb-4 self-end">
                            <div className="relative h-[1px] w-full bg-emerald-500/10">
                                <div className="absolute top-0 left-0 h-full w-2/3 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent animate-pulse" />
                            </div>
                        </div>

                        <div
                            className="transform transition-all duration-600"
                        >
                            {posts.length > 0 ? (
                                <Link href="/blog">
                                    <Button variant="outline" className="group">
                                        View All Articles
                                        <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/admin/blog">
                                    <Button variant="outline" className="group">
                                        Create First Post
                                        <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {featuredPosts.length > 0 ? (
                        featuredPosts.map((post, index) => (
                            <motion.div
                                key={post.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                            >
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="group rounded-2xl border border-border bg-card hover:border-emerald-500/50 overflow-hidden transition-all duration-300 flex flex-col h-full hover:shadow-lg hover:shadow-emerald-500/10"
                                >
                                    <div className="relative h-64 w-full overflow-hidden bg-muted">
                                        {post.image ? (
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/30 flex items-center justify-center">
                                                <span className="text-emerald-600 font-mono text-sm">No Image</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                    </div>

                                    <div className="flex flex-col flex-grow p-6">
                                        <div className="mb-3">
                                            <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                                                {post.category || 'Uncategorized'}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-bold tracking-tight mb-3 line-clamp-2 group-hover:text-emerald-500 transition-colors">
                                            {post.title}
                                        </h3>

                                        <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-grow">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {post.date || 'No date'}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {post.readTime || '5 min read'}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-2 text-center py-12">
                            <p className="text-muted-foreground mb-4">No blog posts available yet.</p>
                            <Link href="/admin/blog">
                                <Button variant="outline">
                                    Create First Post
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
