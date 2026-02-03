"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { BLOG_POSTS } from "@/lib/blog-data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Search, X } from "lucide-react";

export default function BlogPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = Array.from(new Set(BLOG_POSTS.map((post) => post.category)));

    const filteredPosts = useMemo(() => {
        return BLOG_POSTS.filter((post) => {
            const matchesSearch =
                searchTerm === "" ||
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.content.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = selectedCategory === null || post.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);

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
                            Thoughts on web development, design, and technology.
                        </p>
                    </div>

                    <div className="mb-12 space-y-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                            <Input
                                placeholder="Search articles..."
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
                                All
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        selectedCategory === category
                                            ? "bg-emerald-500 text-white"
                                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredPosts.length > 0 ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredPosts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className="group rounded-lg border border-border bg-card hover:border-emerald-500/50 overflow-hidden transition-all duration-300 flex flex-col h-full hover:shadow-lg hover:shadow-emerald-500/10"
                                >
                                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    <div className="flex flex-col flex-grow p-6">
                                        <div className="mb-3">
                                            <Badge variant="secondary" className="mb-2">
                                                {post.category}
                                            </Badge>
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
                                                {post.date}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {post.readTime}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
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
