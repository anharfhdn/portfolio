"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-data";
import { Button } from "@/components/ui/button";

export default function BlogPreview() {
    const featuredPosts = BLOG_POSTS.slice(0, 2);

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
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold tracking-tight"
                        >
                            Latest Articles
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Link href="/blog">
                                <Button variant="outline" className="group">
                                    View All Articles
                                    <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {featuredPosts.map((post, index) => (
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
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                </div>

                                <div className="flex flex-col flex-grow p-6">
                                    <div className="mb-3">
                                        <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                                            {post.category}
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
                                            {post.date}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {post.readTime}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
