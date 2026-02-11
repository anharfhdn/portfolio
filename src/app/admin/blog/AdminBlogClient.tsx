"use client";

import { useState, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import {
  Home,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  TriangleAlert,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarkdownEditor from "@/components/MarkdownEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllBlogPostsAdmin,
  saveBlogPost,
  deleteBlogPost,
  blogVisibilityPost,
} from "@/lib/blog";
import { toast } from "sonner";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string;
  markdown: string;
  status?: "draft" | "published" | "archived";
}

export default function AdminBlogClient({
  adminAddresses,
}: {
  adminAddresses: string[];
}) {
  const { address, isConnected } = useAccount();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Web Development",
    author: "Name",
    image: "",
    excerpt: "",
    readTime: "5 min read",
    markdown: "",
  });

  const CATEGORIES = [
    "Web Development",
    "Blockchain",
    "DeFi",
    "NFT",
    "Smart Contracts",
    "Tutorial",
    "News",
    "Opinion",
    "Books",
    "Life",
  ];

  const STATUS_OPTIONS = [
    { value: "published", label: "Publish", icon: "✅" },
    { value: "draft", label: "Move to Draft", icon: "✏️" },
    { value: "archived", label: "Archive", icon: "📁" },
  ] as const;

  type BlogStatus = "draft" | "published" | "archived";

  const isAdmin =
    isConnected && address
      ? adminAddresses.some(
          (adminAddr) => adminAddr.toLowerCase() === address.toLowerCase(),
        )
      : false;

  useEffect(() => {
    if (isAdmin) {
      (async () => {
        try {
          const remote = await getAllBlogPostsAdmin();
          setPosts(remote as any[]);
        } catch (e) {
          setPosts([]);
          console.warn("Failed to load posts from Supabase", e);
        }
      })();
    }
  }, [isAdmin]);

  const loadPosts = async () => {
    const savedPosts = await getAllBlogPostsAdmin();
    setPosts(savedPosts as any[]);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        post.title?.toLowerCase().includes(searchLower) ||
        post.slug?.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower);

      const matchesCategory =
        selectedCategory === null || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

  const savePosts = async (updatedPosts: BlogPost[]) => {
    for (const p of updatedPosts) {
      await saveBlogPost(p as any);
    }
    setPosts(updatedPosts);
  };

  const handleCreatePost = () => {
    setIsCreating(true);
    setEditingPost(null);
    setFormData({
      title: "",
      slug: "",
      category: "Web Development",
      author: "Name",
      image: "",
      excerpt: "",
      readTime: "5 min read",
      markdown: "",
    });
  };

  const handleEditPost = (post: BlogPost) => {
    setIsCreating(false);
    setIsEditing(true);
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      category: post.category,
      author: post.author,
      image: post.image,
      excerpt: post.excerpt,
      readTime: post.readTime,
      markdown: post.markdown,
    });
  };

  const handleStatusChange = async (
    post: any,
    newStatus: "draft" | "published" | "archived",
  ) => {
    const messages = {
      draft: "Are you sure you want to move this post to draft?",
      published: "Are you sure you want to publish this post?",
      archived: "Are you sure you want to archive this post?",
    };

    if (confirm(messages[newStatus])) {
      const ok = await blogVisibilityPost(post.slug, newStatus);

      if (!ok) {
        console.error(`Failed to change post status to ${newStatus}`);
        alert(`Failed to change post status to ${newStatus}`);
      } else {
        await loadPosts();
      }
    }
  };

  const handleDeleteClick = (slug: string) => {
    setPostToDelete(slug);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);
    try {
      const ok = await deleteBlogPost(postToDelete);
      if (!ok) {
        console.warn("Failed to delete post on server");
      }
      await loadPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  const handleSavePost = async (markdown: string | undefined) => {
    const safeMarkdown = markdown ?? "";

    const newPost: BlogPost = {
      ...formData,
      markdown: safeMarkdown,
      content: "",
      date: editingPost?.date || new Date().toISOString().split("T")[0],
    };

    if (!newPost.slug) {
      newPost.slug = newPost.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    let updatedPosts;
    if (editingPost) {
      updatedPosts = posts.map((p) =>
        p.slug === editingPost.slug ? newPost : p,
      );
    } else {
      updatedPosts = [newPost, ...posts];
    }

    await savePosts(updatedPosts);
    setIsEditing(false);
    setIsCreating(false);
    setEditingPost(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditingPost(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isWebp =
      file.type === "image/webp" || file.name.toLowerCase().endsWith(".webp");

    if (!isWebp) {
      toast("Upload Failed", {
        description: "Please upload a .webp image only.",
        icon: (
          <TriangleAlert size={16} className="text-emerald-500" />
        ) as React.ReactNode,
      });
      e.target.value = "";
      formData.image = "";
      return;
    }

    try {
      setIsUploading(true);

      const fileExt = "webp";
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = fileName;

      const { data, error } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, image: publicUrl }));
    } catch (error: any) {
      console.error("Upload error:", error.message);
      alert("Failed to upload image. Make sure your bucket is public!");
    } finally {
      setIsUploading(false);
    }
  };

  if (typeof window === "undefined") {
    return null;
  }

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-32 pb-24">
          <Card className="w-full max-w-md p-8">
            <div className="text-center space-y-6">
              <h1 className="text-2xl font-bold">Blog Management</h1>
              <p className="text-muted-foreground">
                Please connect your wallet to access blog management.
              </p>
              <Link href="/admin">
                <Button variant="outline" className="w-full">
                  <Home size={18} className="mr-2" />
                  Back to Admin
                </Button>
              </Link>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-32 pb-24">
          <Card className="w-full max-w-md p-8">
            <div className="text-center space-y-6">
              <h1 className="text-2xl font-bold">Access Denied</h1>
              <p className="text-muted-foreground">
                Your wallet address is not authorized to access blog management.
              </p>
              <Link href="/admin">
                <Button variant="outline" className="w-full">
                  <Home size={18} className="mr-2" />
                  Back to Admin
                </Button>
              </Link>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (isCreating || isEditing) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold tracking-tight">
                  {isCreating ? "Create New Post" : "Edit Post"}
                </h1>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>

              <Card className="p-6 mb-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Post title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      placeholder="auto-generated-from-title"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      placeholder="Author name"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Cover Image (.webp only)
                    </label>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept=".webp,image/webp"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="block w-full text-sm text-stone-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-stone-100 file:text-stone-700
                            hover:file:bg-stone-200 cursor-pointer disabled:opacity-50"
                      />
                      {isUploading && (
                        <p className="text-xs text-blue-500 animate-pulse">
                          Uploading to blog-images...
                        </p>
                      )}
                      {formData.image && (
                        <p className="text-xs text-green-600 truncate">
                          Current: {formData.image}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="readTime">Read Time</Label>
                    <Input
                      id="readTime"
                      placeholder="5 min read"
                      value={formData.readTime}
                      onChange={(e) =>
                        setFormData({ ...formData, readTime: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Input
                      id="excerpt"
                      placeholder="Brief description of the post"
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                    />
                  </div>
                </div>
              </Card>

              <MarkdownEditor
                initialContent={formData.markdown}
                onSave={handleSavePost}
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getPostTitle = () => {
    const post = posts.find((p) => p.slug === postToDelete);
    return post ? post.title : "";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold tracking-tight">
                Blog Management
              </h1>
              <div className="flex gap-2">
                <Button onClick={handleCreatePost}>
                  <Plus size={18} className="mr-2" />
                  New Post
                </Button>
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    <Home size={18} className="mr-2" />
                    Admin Home
                  </Button>
                </Link>
              </div>
            </div>
            <p className="text-muted-foreground">
              Manage your blog posts - {posts.length} total posts
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                placeholder="Search by title, slug, or excerpt..."
                className="pl-10 h-11"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {posts.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No blog posts yet. Create your first post!
                </p>
                <Button onClick={handleCreatePost}>
                  <Plus size={18} className="mr-2" />
                  Create First Post
                </Button>
              </Card>
            ) : filteredPosts.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  No posts match your search or filter.
                </p>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <Card
                  key={post.slug}
                  className="p-6 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-40 h-28 flex-shrink-0">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover rounded-md border border-border"
                      />
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                            {post.category || "Uncategorized"}
                          </span>
                          <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {post.slug}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-1">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {post.date}
                          </div>
                          <div>{post.readTime}</div>
                        </div>
                      </div>

                      <div className="flex gap-2 h-fit">
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button
                            className="h-9 px-2"
                            variant="outline"
                            size="sm"
                            title="Preview"
                          >
                            <Eye size={16} />
                          </Button>
                        </Link>

                        <Select
                          value={post.status || "draft"}
                          onValueChange={(value: BlogStatus) =>
                            handleStatusChange(post, value)
                          }
                        >
                          <SelectTrigger className="h-9 w-[120px]">
                            <div className="flex items-center gap-1">
                              {post.status === "published" && (
                                <span className="text-green-600">✅</span>
                              )}
                              {post.status === "draft" && (
                                <span className="text-yellow-600">✏️</span>
                              )}
                              {post.status === "archived" && (
                                <span className="text-gray-600">📁</span>
                              )}
                              <span className="text-xs capitalize">
                                {post.status || "draft"}
                              </span>
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((option) => {
                              if (option.value === post.status)
                                return null as any;
                              return (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  <div className="flex items-center gap-2">
                                    <span>{option.icon}</span>
                                    <span>{option.label}</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        <Button
                          className="h-9 px-2"
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditPost(post)}
                        >
                          <Edit size={16} />
                        </Button>

                        <Button
                          className="h-9 px-2 text-red-600 hover:text-red-700 hover:border-red-600"
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteClick(post.slug)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${getPostTitle()}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        variant="destructive"
        loading={isDeleting}
      />

      <Footer />
    </div>
  );
}
