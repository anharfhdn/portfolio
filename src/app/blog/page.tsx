"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllBlogPosts } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Search, X } from "lucide-react";

export default function BlogPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            const remote = await getAllBlogPosts();
            setPosts(remote as any[]);
        })();
    }, []);

    const categories = Array.from(new Set(posts.filter(post => post.category).map((post) => post.category)));

    const filteredPosts = useMemo(() => {
        if (!posts || posts.length === 0) return [];
        
        return posts.filter((post) => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                searchTerm === "" ||
                (post.title && post.title.toLowerCase().includes(searchLower)) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(searchLower)) ||
                (post.content && post.content.toLowerCase().includes(searchLower)) ||
                (post.markdown && post.markdown.toLowerCase().includes(searchLower)) ||
                (post.author && post.author.toLowerCase().includes(searchLower)) ||
                (post.category && post.category.toLowerCase().includes(searchLower));

            const matchesCategory = selectedCategory === null || post.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [posts, searchTerm, selectedCategory]);

    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 pb-24 grid-bg">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                            Blog
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Thoughts on life, web development, design, technology, books, etc. {posts.length > 0 && `${posts.length} article${posts.length !== 1 ? 's' : ''} available.`}
                        </p>
                    </div>

                    <div className="mb-12 space-y-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                            <Input
                                placeholder="Search articles by title, content, author, or category..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    selectedCategory === null
                                        ? "bg-emerald-500 text-white"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                            >
                                All {posts.length > 0 && `(${posts.length})`}
                            </button>
                            {categories.map((category) => {
                                const categoryCount = posts.filter(post => post.category === category).length;
                                return (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                            selectedCategory === category
                                                ? "bg-emerald-500 text-white"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                        }`}
                                    >
                                        {category} ({categoryCount})
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {filteredPosts.length > 0 ? (
                        <>
                            {searchTerm && (
                                <div className="mb-6 text-sm text-muted-foreground">
                                    Found {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} matching "{searchTerm}"
                                </div>
                            )}
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredPosts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className="group rounded-lg border border-border bg-card hover:border-emerald-500/50 overflow-hidden transition-all duration-300 flex flex-col h-full hover:shadow-lg hover:shadow-emerald-500/10"
                                >
                                    <div className="relative h-48 w-full overflow-hidden bg-muted">
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
                                    </div>

                                    <div className="flex flex-col flex-grow p-6">
                                        <div className="mb-3">
                                            <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                                                {post.category || 'Uncategorized'}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold tracking-tight mb-3 line-clamp-2 group-hover:text-emerald-500 transition-colors">
                                            {post.title}
                                        </h3>

                                        <p className="text-sm text-muted-foreground mb-6 line-clamp-3 flex-grow">
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
                            ))}
                            </div>
                        </>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-lg text-muted-foreground mb-4">
                                No blog posts available yet.
                            </p>
                            <Link href="/admin/blog">
                                <button className="text-emerald-500 hover:text-emerald-600 font-medium transition-colors">
                                    Create your first post
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-lg text-muted-foreground mb-4">
                                No posts found matching your criteria.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory(null);
                                }}
                                className="text-emerald-500 hover:text-emerald-600 font-medium transition-colors"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
