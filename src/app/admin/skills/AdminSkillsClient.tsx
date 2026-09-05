"use client";

import React from "react";
import { useState, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import {
  Home,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  getAllSkillsAdmin,
  saveSkill,
  deleteSkill,
  skillVisibility,
  type SkillStatus,
} from "@/lib/skills";
import { toast } from "sonner";
import { Computer } from "lucide-react";
import { z } from "zod";
import IconPicker from "@/components/ui/icon-picker";
import {
  moveAndRenumber,
  orderedPosition,
  orderedCount,
  nextOrder,
} from "@/lib/reorder";
import { STATUS_OPTIONS } from "@/lib/status";

interface Skill {
  slug: string;
  title: string;
  items: string[];
  icons?: string[];
  display_order: number;
  status?: SkillStatus;
}

const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const emptyForm = {
  title: "",
  slug: "",
};

type ItemRow = { name: string; icon: string };

export default function AdminSkillsClient({
  adminAddresses,
}: {
  adminAddresses: string[];
}) {
  const { address, isConnected } = useAccount();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusConfig, setStatusConfig] = useState<{
    skill: any;
    newStatus: SkillStatus | null;
  }>({ skill: null, newStatus: null });
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [reorderingSlug, setReorderingSlug] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState(emptyForm);
  const [itemRows, setItemRows] = useState<ItemRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const skillSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens"),
  });

  const isAdmin =
    isConnected && address
      ? adminAddresses.some(
          (a) => a.toLowerCase() === address.toLowerCase(),
        )
      : false;

  useEffect(() => {
    if (isAdmin) {
      (async () => {
        try {
          setSkills((await getAllSkillsAdmin()) as any[]);
        } catch (e) {
          setSkills([]);
          console.warn("Failed to load skills from Supabase", e);
        }
      })();
    }
  }, [isAdmin]);

  const loadSkills = async () => {
    setSkills((await getAllSkillsAdmin()) as any[]);
  };

  const filtered = useMemo(
    () =>
      skills.filter((s) => {
        const q = searchTerm.toLowerCase();
        return (
          searchTerm === "" ||
          s.title?.toLowerCase().includes(q) ||
          s.slug?.toLowerCase().includes(q)
        );
      }),
    [skills, searchTerm],
  );

  const handleCreate = () => {
    setIsCreating(true);
    setEditingSkill(null);
    setFormData(emptyForm);
    setItemRows([]);
    setValidationErrors({});
  };

  const handleEdit = (skill: Skill) => {
    setIsCreating(false);
    setIsEditing(true);
    setEditingSkill(skill);
    setFormData({
      title: skill.title,
      slug: skill.slug,
    });
    const items = skill.items || [];
    const icons = skill.icons || [];
    setItemRows(items.map((name, i) => ({ name, icon: icons[i] || "" })));
    setValidationErrors({});
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const validation = skillSchema.safeParse(formData);
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
      }
      setValidationErrors({});
      const v = validation.data;
      const rows = itemRows
        .map((r) => ({ name: r.name.trim(), icon: r.icon }))
        .filter((r) => r.name !== "");
      const payload: Skill = {
        slug: v.slug || generateSlug(v.title),
        title: v.title,
        items: rows.map((r) => r.name),
        icons: rows.map((r) => r.icon),
        display_order: editingSkill
          ? (skills.find((s) => s.slug === editingSkill.slug)
              ?.display_order ?? 0)
          : nextOrder(skills),
      };
      const updated = editingSkill
        ? skills.map((s) =>
            s.slug === editingSkill.slug
              ? { ...payload, status: s.status }
              : s,
          )
        : [payload, ...skills];
      for (const p of updated) await saveSkill(p as any);
      setSkills(updated);
      toast("Success", {
        description: editingSkill ? "Skill updated" : "Skill created",
        icon: <Computer size={16} className="text-emerald-500" />,
      });
      setIsEditing(false);
      setIsCreating(false);
      setEditingSkill(null);
      setFormData(emptyForm);
      setItemRows([]);
    } catch (e) {
      console.error("Save skill error:", e);
      toast("Error", { description: "Failed to save skill" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveSkill = async (slug: string, dir: -1 | 1) => {
    const updated = moveAndRenumber(skills, slug, dir);
    if (!updated) return;
    setReorderingSlug(slug);
    try {
      for (const p of updated) await saveSkill(p as any);
      setSkills(updated);
    } catch (e) {
      console.error("Error reordering skills:", e);
      toast("Error", { description: "Failed to reorder skills" });
    } finally {
      setReorderingSlug(null);
    }
  };

  const handleConfirmStatusChange = async () => {
    const { skill, newStatus } = statusConfig;
    if (!skill || !newStatus) return;
    setIsChangingStatus(true);
    try {
      await skillVisibility(skill.slug, newStatus);
      await loadSkills();
      setStatusDialogOpen(false);
    } catch (e) {
      console.error(e);
      alert("Error updating skill status.");
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!skillToDelete) return;
    setIsDeleting(true);
    try {
      await deleteSkill(skillToDelete);
      await loadSkills();
    } catch (e) {
      console.error("Error deleting skill:", e);
    } finally {
      setIsDeleting(false);
      setSkillToDelete(null);
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-32 pb-24">
          <Card className="w-full max-w-md p-8">
            <div className="text-center space-y-6">
              <h1 className="text-2xl font-bold">Skill Management</h1>
              <p className="text-muted-foreground">
                Please connect your wallet to access skill management.
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
                Your wallet address is not authorized.
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold tracking-tight">
                {isCreating ? "Create New Skill" : "Edit Skill"}
              </h1>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setIsCreating(false);
                  setEditingSkill(null);
                }}
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
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                        slug: generateSlug(e.target.value),
                      })
                    }
                    disabled={isSaving}
                    className={validationErrors.title ? "border-red-500" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    disabled={isSaving}
                    className={validationErrors.slug ? "border-red-500" : ""}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Items & Icons</Label>
                  <div className="space-y-2">
                    {itemRows.map((row, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          placeholder="Solidity, Go, Rust..."
                          value={row.name}
                          onChange={(e) =>
                            setItemRows((prev) =>
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
                            setItemRows((prev) =>
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
                            setItemRows((prev) =>
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
                        setItemRows((prev) => [...prev, { name: "", icon: "" }])
                      }
                    >
                      <Plus size={16} className="mr-2" />
                      Add Item
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setIsCreating(false);
                  setEditingSkill(null);
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <span className="flex items-center">
                    <Spinner className="mr-2 h-4 w-4" />
                    Saving...
                  </span>
                ) : editingSkill ? (
                  "Update Skill"
                ) : (
                  "Create Skill"
                )}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow grid-bg pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Skill Management
            </h1>
            <div className="flex gap-2">
              <Button onClick={handleCreate} size="sm">
                <Plus size={18} className="mr-2" />
                New Skill
              </Button>
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <Home size={18} className="mr-2" />
                  Admin Home
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-muted-foreground mb-12">
            Manage your skills - {skills.length} total skills
          </p>

          <div className="mb-12">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
                size={18}
              />
              <Input
                placeholder="Search skills..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {filtered.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  {skills.length === 0
                    ? "No skills yet. Create your first skill!"
                    : "No skills match your search or filter."}
                </p>
              </Card>
            ) : (
              filtered.map((skill) => (
                <Card key={skill.slug} className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground">
                          #{skill.display_order ?? 0} · {skill.slug}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-1">{skill.title}</h3>
                      {(skill.items || []).length > 0 && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {skill.items.join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 h-fit">
                      <div className="flex flex-col gap-1">
                        <Button
                          className="h-4 px-1"
                          size="sm"
                          variant="ghost"
                          title="Move up"
                          onClick={() => handleMoveSkill(skill.slug, -1)}
                          disabled={
                            reorderingSlug !== null ||
                            isSaving ||
                            orderedPosition(skills, skill.slug) <= 0
                          }
                        >
                          <ChevronUp size={14} />
                        </Button>
                        <Button
                          className="h-4 px-1"
                          size="sm"
                          variant="ghost"
                          title="Move down"
                          onClick={() => handleMoveSkill(skill.slug, 1)}
                          disabled={
                            reorderingSlug !== null ||
                            isSaving ||
                            orderedPosition(skills, skill.slug) >=
                              orderedCount(skills) - 1
                          }
                        >
                          <ChevronDown size={14} />
                        </Button>
                      </div>
                      <Select
                        value={skill.status || "draft"}
                        onValueChange={(v: SkillStatus) => {
                          setStatusConfig({ skill, newStatus: v });
                          setStatusDialogOpen(true);
                        }}
                      >
                        <SelectTrigger className="h-9 w-[120px]">
                          <span className="text-xs capitalize">
                            {skill.status || "draft"}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.filter(
                            (o) => o.value !== skill.status,
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
                        onClick={() => handleEdit(skill)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        className="h-9 px-2 text-red-600 hover:text-red-700 hover:border-red-600"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSkillToDelete(skill.slug);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
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
        title="Change Skill Status"
        description={`Change "${statusConfig.skill?.title}" to ${statusConfig.newStatus}?`}
        confirmText="Update Status"
        cancelText="Cancel"
        onConfirm={handleConfirmStatusChange}
        variant="default"
        loading={isChangingStatus}
      />
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Skill"
        description="This action cannot be undone."
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
