"use client";

import React from "react";
import { useState, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import {
  Home,
  Plus,
  Edit,
  Trash2,
  Calendar,
  TriangleAlert,
  Search,
  X,
  Lock,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllProjectsAdmin,
  saveProject,
  deleteProject,
  projectVisibility,
  type ProjectStatus,
} from "@/lib/projects";
import { toast } from "sonner";
import { Computer } from "lucide-react";
import { z } from "zod";
import {
  moveAndRenumber,
  orderedPosition,
  orderedCount,
  nextOrder,
} from "@/lib/reorder";
import { STATUS_OPTIONS } from "@/lib/status";
import IconPicker from "@/components/ui/icon-picker";
import type {ExperienceStatus} from "@/lib/experience";

interface Project {
  slug: string;
  title: string;
  client: string;
  description: string;
  image: string;
  tags: string[];
  tag_icons?: string[];
  link: string;
  confidential: boolean;
  display_order: number;
  date: string;
  status?: ProjectStatus;
}

const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const emptyForm = {
  title: "",
  slug: "",
  client: "",
  description: "",
  link: "",
  confidential: false,
  image: "",
};

type TagRow = { name: string; icon: string };

export default function AdminProjectsClient({
  adminAddresses,
}: {
  adminAddresses: string[];
}) {
  const { address, isConnected } = useAccount();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusConfig, setStatusConfig] = useState<{
    project: any;
    newStatus: ProjectStatus | null;
  }>({
    project: null,
    newStatus: null,
  });
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [reorderingSlug, setReorderingSlug] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const [formData, setFormData] = useState(emptyForm);
  const [tagRows, setTagRows] = useState<TagRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const projectSchema = z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title must be less than 100 characters"),
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(
        /^[a-z0-9-]+$/,
        "Slug must contain only lowercase letters, numbers, and hyphens",
      ),
    client: z.string().max(100, "Client must be less than 100 characters"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(500, "Description must be less than 500 characters"),
    link: z
      .string()
      .url("Link must be a valid URL")
      .optional()
      .or(z.string().max(0))
      .or(z.literal("#")),
    image: z
      .string()
      .url("Image must be a valid URL")
      .optional()
      .or(z.string().max(0)),
  });

  const STATUS_FILTERS = ["draft", "published", "archived"];

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
          const remote = await getAllProjectsAdmin();
          setProjects(remote as any[]);
        } catch (e) {
          setProjects([]);
          console.warn("Failed to load projects from Supabase", e);
        }
      })();
    }
  }, [isAdmin]);

  const loadProjects = async () => {
    const saved = await getAllProjectsAdmin();
    setProjects(saved as any[]);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        project.title?.toLowerCase().includes(searchLower) ||
        project.slug?.toLowerCase().includes(searchLower) ||
        project.client?.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower);

      const matchesStatus =
        selectedStatus === null || project.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, selectedStatus]);

  const saveProjects = async (updated: Project[]) => {
    for (const p of updated) {
      await saveProject(p as any);
    }
    setProjects(updated);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingProject(null);
    setFormData(emptyForm);
    setTagRows([]);
    setValidationErrors({});
  };

  const handleEdit = (project: Project) => {
    setIsCreating(false);
    setIsEditing(true);
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      client: project.client || "",
      description: project.description || "",
      link: project.confidential ? "" : project.link || "",
      confidential: project.confidential ?? project.link === "#",
      image: project.image || "",
    });
    const tags = project.tags || [];
    const icons = project.tag_icons || [];
    setTagRows(tags.map((name, i) => ({ name, icon: icons[i] || "" })));
    setValidationErrors({});
  };

  const handleMoveProject = async (slug: string, dir: -1 | 1) => {
    const updated = moveAndRenumber(projects, slug, dir);
    if (!updated) return;
    setReorderingSlug(slug);
    try {
      await saveProjects(updated);
    } catch (e) {
      console.error("Error reordering projects:", e);
      toast("Error", { description: "Failed to reorder projects" });
    } finally {
      setReorderingSlug(null);
    }
  };

  const handleStatusChangeClick = (project: any, newStatus: ProjectStatus) => {
    setStatusConfig({ project, newStatus });
    setStatusDialogOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    const { project, newStatus } = statusConfig;
    if (!project || !newStatus) return;

    setIsChangingStatus(true);
    try {
      const ok = await projectVisibility(project.slug, newStatus);

      if (!ok) {
        console.warn(`Failed to update status to ${newStatus}`);
      }

      await loadProjects();

      setStatusDialogOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error updating project status.");
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleDeleteClick = (slug: string) => {
    setProjectToDelete(slug);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      const ok = await deleteProject(projectToDelete);
      if (!ok) {
        console.warn("Failed to delete project on server");
      }
      await loadProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const validation = projectSchema.safeParse(formData);
      if (!validation.success) {
        const errors: Record<string, string> = {};
        validation.error.issues.forEach((issue) => {
          const field = issue.path[0] as string;
          errors[field] = issue.message;
          toast("Validation Error", {
            description: `${field}: ${issue.message}`,
            icon: <Computer size={16} className="text-emerald-500" />,
          });
        });
        setValidationErrors(errors);
        return;
      } else {
        setValidationErrors({});
      }

      const validatedData = validation.data;
      const rows = tagRows
        .map((r) => ({ name: r.name.trim(), icon: r.icon }))
        .filter((r) => r.name !== "");

      const newProject: Project = {
        slug: validatedData.slug || generateSlug(validatedData.title),
        title: validatedData.title,
        client: validatedData.client,
        description: validatedData.description,
        image: validatedData.image || "",
        tags: rows.map((r) => r.name),
        tag_icons: rows.map((r) => r.icon),
        link: formData.confidential ? "#" : validatedData.link || "#",
        confidential: formData.confidential,
        display_order: editingProject
          ? (projects.find((p) => p.slug === editingProject.slug)
              ?.display_order ?? 0)
          : nextOrder(projects),
        date:
          editingProject?.date || new Date().toISOString().split("T")[0],
      };

      let updated;
      if (editingProject) {
        updated = projects.map((p) =>
          p.slug === editingProject.slug ? { ...newProject, status: p.status } : p,
        );
      } else {
        updated = [newProject, ...projects];
      }

      await saveProjects(updated);
      toast("Success", {
        description: editingProject
          ? "Project updated successfully"
          : "Project created successfully",
        icon: <Computer size={16} className="text-emerald-500" />,
      });
      setIsEditing(false);
      setIsCreating(false);
      setEditingProject(null);
      setFormData(emptyForm);
      setTagRows([]);
    } catch (error) {
      toast("Error", {
        description: "Failed to save project",
        icon: <Computer size={16} className="text-emerald-500" />,
      });
      console.error("Save project error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditingProject(null);
    setTagRows([]);
    setValidationErrors({});
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
      setFormData((prev) => ({ ...prev, image: "" }));
      return;
    }

    try {
      setIsUploading(true);

      const fileExt = "webp";
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = fileName;

      const { error } = await supabase.storage
        .from("project-images")
        .upload(filePath, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("project-images").getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, image: publicUrl }));
    } catch (error: any) {
      console.error("Upload error:", error.message);
      alert("Failed to upload image. Make sure your bucket is public!");
    } finally {
      setIsUploading(false);
    }
  };

  const clearError = (field: string) => {
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-32 pb-24">
          <Card className="w-full max-w-md p-8">
            <div className="text-center space-y-6">
              <h1 className="text-2xl font-bold">Project Management</h1>
              <p className="text-muted-foreground">
                Please connect your wallet to access project management.
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
                Your wallet address is not authorized to access project
                management.
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
        <main className="flex-grow grid-bg pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold tracking-tight">
                  {isCreating ? "Create New Project" : "Edit Project"}
                </h1>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>

              <Card className="p-6 mb-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Project title"
                      value={formData.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setFormData({
                          ...formData,
                          title: newTitle,
                          slug: generateSlug(newTitle),
                        });
                        clearError("title");
                        clearError("slug");
                      }}
                      disabled={isSaving}
                      className={validationErrors.title ? "border-red-500" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      placeholder="auto-generated-from-title"
                      value={formData.slug}
                      onChange={(e) => {
                        setFormData({ ...formData, slug: e.target.value });
                        clearError("slug");
                      }}
                      disabled={isSaving}
                      className={validationErrors.slug ? "border-red-500" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <Input
                      id="client"
                      placeholder="Client or organization"
                      value={formData.client}
                      onChange={(e) => {
                        setFormData({ ...formData, client: e.target.value });
                        clearError("client");
                      }}
                      disabled={isSaving}
                      className={validationErrors.client ? "border-red-500" : ""}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the project"
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        });
                        clearError("description");
                      }}
                      disabled={isSaving}
                      className={
                        validationErrors.description ? "border-red-500" : ""
                      }
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Tags & Icons</Label>
                    <div className="space-y-2">
                      {tagRows.map((row, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            placeholder="Go, Rust, Solidity..."
                            value={row.name}
                            onChange={(e) =>
                              setTagRows((prev) =>
                                prev.map((r, j) =>
                                  j === i ? { ...r, name: e.target.value } : r,
                                ),
                              )
                            }
                            disabled={isSaving}
                            className="flex-1"
                          />
                          <IconPicker
                            value={row.icon}
                            disabled={isSaving}
                            onChange={(icon) =>
                              setTagRows((prev) =>
                                prev.map((r, j) =>
                                  j === i ? { ...r, icon } : r,
                                ),
                              )
                            }
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={isSaving}
                            onClick={() =>
                              setTagRows((prev) =>
                                prev.filter((_, j) => j !== i),
                              )
                            }
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isSaving}
                        onClick={() =>
                          setTagRows((prev) => [...prev, { name: "", icon: "" }])
                        }
                      >
                        <Plus size={16} className="mr-2" />
                        Add Tag
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="link">Source Link</Label>
                    <Input
                      id="link"
                      placeholder="https://github.com/... or #"
                      value={formData.link}
                      onChange={(e) => {
                        setFormData({ ...formData, link: e.target.value });
                        clearError("link");
                      }}
                      disabled={isSaving || formData.confidential}
                      className={validationErrors.link ? "border-red-500" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confidential">Confidential (NDA)</Label>
                    <div className="flex items-center gap-3 h-10">
                      <Switch
                        id="confidential"
                        checked={formData.confidential}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, confidential: checked })
                        }
                        disabled={isSaving}
                      />
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Lock size={14} />
                        {formData.confidential
                          ? "Shows Confidential toast"
                          : "Opens source link"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">
                      Cover Image (.webp only)
                    </label>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept=".webp,image/webp"
                        onChange={handleImageUpload}
                        disabled={isUploading || isSaving}
                        className="block w-full text-sm text-stone-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-stone-100 file:text-stone-700
                            hover:file:bg-stone-200 cursor-pointer disabled:opacity-50"
                      />
                      {isUploading && (
                        <p className="text-xs text-blue-500 animate-pulse">
                          Uploading to project-images...
                        </p>
                      )}
                      {formData.image && (
                        <p className="text-xs text-green-600 truncate">
                          Current: {formData.image}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving || isUploading}>
                  {isSaving ? (
                    <span className="flex items-center">
                      <Spinner className="mr-2 h-4 w-4" />
                      Saving...
                    </span>
                  ) : editingProject ? (
                    "Update Project"
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getProjectTitle = () => {
    const project = projects.find((p) => p.slug === projectToDelete);
    return project ? project.title : "";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow grid-bg pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold tracking-tight">
                Project Management
              </h1>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreate}
                  size="sm"
                  disabled={isSaving || isChangingStatus || isDeleting}
                >
                  <Plus size={18} className="mr-2" />
                  New Project
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
              Manage your portfolio projects - {projects.length} total projects
            </p>
          </div>

          <div className="mb-12 space-y-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
                size={18}
              />
              <Input
                placeholder="Search projects by title, client, or description..."
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
                onClick={() => setSelectedStatus(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedStatus === null
                    ? "bg-emerald-500 text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                All {projects.length > 0 && `(${projects.length})`}
              </button>
              {STATUS_FILTERS.map((status) => {
                const count = projects.filter(
                  (p) => p.status === status,
                ).length;
                return (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                      selectedStatus === status
                        ? "bg-emerald-500 text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {status} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            {projects.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No projects yet. Create your first project!
                </p>
                <Button
                  onClick={handleCreate}
                  disabled={isSaving || isChangingStatus || isDeleting}
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <Spinner className="mr-2 h-4 w-4" />
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Plus size={18} className="mr-2" />
                      Create First Project
                    </div>
                  )}
                </Button>
              </Card>
            ) : filteredProjects.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  No projects match your search or filter.
                </p>
              </Card>
            ) : (
              filteredProjects.map((project) => (
                <Card
                  key={project.slug}
                  className="p-6 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-40 h-28 flex-shrink-0">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover rounded-md border border-border"
                        />
                      ) : (
                        <div className="w-full h-full rounded-md border border-border bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">
                            No image
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {project.slug}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            #{project.display_order ?? 0}
                          </span>
                          {project.confidential && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600 rounded-full">
                              <Lock size={10} />
                              NDA
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-1">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          For: {project.client || "—"}
                        </p>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {project.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {project.date || "No date"}
                          </div>
                          <div className="truncate max-w-[300px]">
                            {(project.tags || []).join(", ")}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 h-fit">
                        <div className="flex flex-col gap-1">
                          <Button
                            className="h-4 px-1"
                            size="sm"
                            variant="ghost"
                            title="Move up"
                            onClick={() => handleMoveProject(project.slug, -1)}
                            disabled={
                              reorderingSlug !== null ||
                              isSaving ||
                              orderedPosition(projects, project.slug) <= 0
                            }
                          >
                            <ChevronUp size={14} />
                          </Button>
                          <Button
                            className="h-4 px-1"
                            size="sm"
                            variant="ghost"
                            title="Move down"
                            onClick={() => handleMoveProject(project.slug, 1)}
                            disabled={
                              reorderingSlug !== null ||
                              isSaving ||
                              orderedPosition(projects, project.slug) >=
                                orderedCount(projects) - 1
                            }
                          >
                            <ChevronDown size={14} />
                          </Button>
                        </div>
                        <Select
                            value={project.status || "draft"}
                            onValueChange={(v: ExperienceStatus) => {
                              setStatusConfig({ project, newStatus: v });
                              setStatusDialogOpen(true);
                            }}
                        >
                          <SelectTrigger className="h-9 w-[120px]">
                          <span className="text-xs capitalize">
                            {project.status || "draft"}
                          </span>
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.filter(
                                (o) => o.value !== project.status,
                            ).map((o) => (
                                <SelectItem key={o.value} value={o.value}>
                                  {o.label}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button
                          className="h-9 px-2"
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(project)}
                          disabled={isSaving || isChangingStatus || isDeleting}
                        >
                          <>
                            {isSaving ? (
                              <>
                                <Spinner className="size-4 animate-spin" />
                                <span className="sr-only">Saving...</span>
                              </>
                            ) : (
                              <Edit size={16} />
                            )}
                          </>
                        </Button>

                        <Button
                          className="h-9 px-2 text-red-600 hover:text-red-700 hover:border-red-600"
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteClick(project.slug)}
                          disabled={isDeleting && projectToDelete !== project.slug}
                        >
                          <>
                            {isDeleting && projectToDelete === project.slug ? (
                              <>
                                <Spinner className="size-4 animate-spin" />
                                <span className="sr-only">Deleting...</span>
                              </>
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </>
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
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        title="Change Project Status"
        description={`Are you sure you want to change the status of "${statusConfig.project?.title}" to ${statusConfig.newStatus}?`}
        confirmText="Update Status"
        cancelText="Cancel"
        onConfirm={handleConfirmStatusChange}
        variant="default"
        loading={isChangingStatus}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Project"
        description={`Are you sure you want to delete "${getProjectTitle()}"? This action cannot be undone.`}
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
