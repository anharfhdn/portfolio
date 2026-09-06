"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const FEATURED_POST_COUNT = 3;

export default function BlogPreview() {
  const [posts, setPosts] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    (async () => {
      const allPosts = await getAllBlogPosts();
      const sortedPosts = allPosts.sort((a, b) => {
        const dateA = new Date(a.date || "1970-01-01");
        const dateB = new Date(b.date || "1970-01-01");
        return dateB.getTime() - dateA.getTime();
      });
      setPosts(sortedPosts.slice(0, FEATURED_POST_COUNT) as any[]);
    })();
  }, []);

  return (
    <section id="blog" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Blog
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="md:text-7xl font-medium tracking-tight leading-[1.05]">
              Latest Thoughts
            </h2>

            <div>
              {posts.length > 0 ? (
                <Link href="/blog">
                  <Button
                    variant="outline"
                    className="group bg-muted/50 rounded-full"
                  >
                    View All Articles
                    <ArrowUpRight
                      size={16}
                      className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  </Button>
                </Link>
              ) : (
                <Link href="/admin/blog">
                  <Button variant="outline" className="group rounded-full">
                    Create First Post
                    <ArrowUpRight
                      size={16}
                      className="ml-2 bg-muted/50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={mounted ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group rounded-3xl bg-muted/50 overflow-hidden transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-muted">
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
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground mb-4">
                No blog posts available yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
