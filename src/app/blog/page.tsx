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

  const categories = Array.from(
    new Set(posts.filter((post) => post.category).map((post) => post.category)),
  );

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

      const matchesCategory =
        selectedCategory === null || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Blog
            </p>
            <h1 className="md:text-7xl font-medium tracking-tight mb-4 leading-[1.05]">
              Thoughts & Notes
            </h1>
            <p className="text-lg text-muted-foreground">
              Thoughts on life, programming, work, design, technology, books, etc.
            </p>
            <p className="text-muted-foreground">
              {posts.length > 0 &&
                `${posts.length} article${posts.length !== 1 ? "s" : ""} available.`}
            </p>
          </div>

          <div className="mb-12 space-y-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
                size={18}
              />
              <Input
                placeholder="Search articles by title, content, author, or category..."
                className="pl-10 rounded-full"
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === null
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                All {posts.length > 0 && `(${posts.length})`}
              </button>
              {categories.map((category) => {
                const categoryCount = posts.filter(
                  (post) => post.category === category,
                ).length;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-foreground text-background"
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
                  Found {filteredPosts.length} article
                  {filteredPosts.length !== 1 ? "s" : ""} matching "{searchTerm}
                  "
                </div>
              )}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group rounded-3xl bg-card bg-muted/50 overflow-hidden transition-all duration-300 flex flex-col h-full hover:shadow-lg"
                  >
                    <div className="relative h-56 w-full">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground text-sm">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col flex-grow p-6">
                      <h3 className="text-xl font-medium tracking-tight mb-3 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-6 line-clamp-3 flex-grow">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
                        <div className="flex items-center gap-4">
                          <span className="inline-block px-3 py-1 rounded-full text-xs text-muted-foreground bg-muted/60 font-medium w-fit">
                            {post.category || "Uncategorized"}
                          </span>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {post.date || "No date"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {post.readTime || "5 min read"}
                          </div>
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
                className="text-foreground underline underline-offset-4 font-medium transition-colors"
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
