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
import { Textarea } from "@/components/ui/textarea";
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
  getAllExperienceAdmin,
  saveExperience,
  deleteExperience,
  experienceVisibility,
  type ExperienceStatus,
} from "@/lib/experience";
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

interface ExperienceItem {
  slug: string;
  company: string;
  role: string;
  period: string;
  description: string;
  location: string;
  display_order: number;
  status?: ExperienceStatus;
}

const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const emptyForm = {
  company: "",
  role: "",
  slug: "",
  period: "",
  location: "",
  description: "",
};

export default function AdminExperienceClient({
  adminAddresses,
}: {
  adminAddresses: string[];
}) {
  const { address, isConnected } = useAccount();
  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusConfig, setStatusConfig] = useState<{
    item: any;
    newStatus: ExperienceStatus | null;
  }>({ item: null, newStatus: null });
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [reorderingSlug, setReorderingSlug] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState(emptyForm);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const experienceSchema = z.object({
    company: z.string().min(1, "Company is required").max(100),
    role: z.string().min(1, "Role is required").max(100),
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
          setItems((await getAllExperienceAdmin()) as any[]);
        } catch (e) {
          setItems([]);
          console.warn("Failed to load experience from Supabase", e);
        }
      })();
    }
  }, [isAdmin]);

  const loadItems = async () => {
    setItems((await getAllExperienceAdmin()) as any[]);
  };

  const filtered = useMemo(
    () =>
      items.filter((i) => {
        const q = searchTerm.toLowerCase();
        return (
          searchTerm === "" ||
          i.company?.toLowerCase().includes(q) ||
          i.role?.toLowerCase().includes(q) ||
          i.slug?.toLowerCase().includes(q)
        );
      }),
    [items, searchTerm],
  );

  const handleCreate = () => {
    setIsCreating(true);
    setEditingItem(null);
    setFormData(emptyForm);
    setValidationErrors({});
  };

  const handleEdit = (item: ExperienceItem) => {
    setIsCreating(false);
    setIsEditing(true);
    setEditingItem(item);
    setFormData({
      company: item.company,
      role: item.role,
      slug: item.slug,
      period: item.period || "",
      location: item.location || "",
      description: item.description || "",
    });
    setValidationErrors({});
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const validation = experienceSchema.safeParse(formData);
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
      const payload: ExperienceItem = {
        slug: v.slug || generateSlug(`${v.company}-${v.role}`),
        company: v.company,
        role: v.role,
        period: formData.period,
        location: formData.location,
        description: formData.description,
        display_order: editingItem
          ? (items.find((i) => i.slug === editingItem.slug)?.display_order ?? 0)
          : nextOrder(items),
      };
      const updated = editingItem
        ? items.map((i) =>
            i.slug === editingItem.slug ? { ...payload, status: i.status } : i,
          )
        : [payload, ...items];
      for (const p of updated) await saveExperience(p as any);
      setItems(updated);
      toast("Success", {
        description: editingItem ? "Experience updated" : "Experience created",
        icon: <Computer size={16} className="text-emerald-500" />,
      });
      setIsEditing(false);
      setIsCreating(false);
      setEditingItem(null);
      setFormData(emptyForm);
    } catch (e) {
      console.error("Save experience error:", e);
      toast("Error", { description: "Failed to save experience" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveItem = async (slug: string, dir: -1 | 1) => {
    const updated = moveAndRenumber(items, slug, dir);
    if (!updated) return;
    setReorderingSlug(slug);
    try {
      for (const p of updated) await saveExperience(p as any);
      setItems(updated);
    } catch (e) {
      console.error("Error reordering experience:", e);
      toast("Error", { description: "Failed to reorder experience" });
    } finally {
      setReorderingSlug(null);
    }
  };

  const handleConfirmStatusChange = async () => {
    const { item, newStatus } = statusConfig;
    if (!item || !newStatus) return;
    setIsChangingStatus(true);
    try {
      await experienceVisibility(item.slug, newStatus);
      await loadItems();
      setStatusDialogOpen(false);
    } catch (e) {
      console.error(e);
      alert("Error updating experience status.");
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await deleteExperience(itemToDelete);
      await loadItems();
    } catch (e) {
      console.error("Error deleting experience:", e);
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-32 pb-24">
          <Card className="w-full max-w-md p-8">
            <div className="text-center space-y-6">
              <h1 className="text-2xl font-bold">Experience Management</h1>
              <p className="text-muted-foreground">
                Please connect your wallet to access experience management.
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
                {isCreating ? "Create Experience" : "Edit Experience"}
              </h1>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setIsCreating(false);
                  setEditingItem(null);
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
            <Card className="p-6 mb-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: e.target.value,
                        slug: generateSlug(
                          `${e.target.value}-${formData.role}`,
                        ),
                      })
                    }
                    disabled={isSaving}
                    className={validationErrors.company ? "border-red-500" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value,
                        slug: generateSlug(
                          `${formData.company}-${e.target.value}`,
                        ),
                      })
                    }
                    disabled={isSaving}
                    className={validationErrors.role ? "border-red-500" : ""}
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
                <div className="space-y-2">
                  <Label htmlFor="period">Period</Label>
                  <Input
                    id="period"
                    placeholder="2021 — Present"
                    value={formData.period}
                    onChange={(e) =>
                      setFormData({ ...formData, period: e.target.value })
                    }
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Bogor, ID"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder={"Summary paragraph\n- bullet one\n- bullet two"}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    disabled={isSaving}
                  />
                </div>
              </div>
            </Card>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setIsCreating(false);
                  setEditingItem(null);
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
                ) : editingItem ? (
                  "Update Experience"
                ) : (
                  "Create Experience"
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
              Experience Management
            </h1>
            <div className="flex gap-2">
              <Button onClick={handleCreate} size="sm">
                <Plus size={18} className="mr-2" />
                New Experience
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
            Manage your work experience - {items.length} total entries
          </p>

          <div className="mb-12 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
              size={18}
            />
            <Input
              placeholder="Search by company or role..."
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

          <div className="space-y-4">
            {filtered.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  {items.length === 0
                    ? "No experience yet. Create your first entry!"
                    : "No entries match your search."}
                </p>
              </Card>
            ) : (
              filtered.map((item) => (
                <Card key={item.slug} className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground">
                          #{item.display_order ?? 0} · {item.slug}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-1">{item.role}</h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {item.company}
                        {item.location ? ` · ${item.location}` : ""}
                        {item.period ? ` · ${item.period}` : ""}
                      </p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.description}
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
                            onClick={() => handleMoveItem(item.slug, -1)}
                            disabled={
                                reorderingSlug !== null ||
                                isSaving ||
                                orderedPosition(items, item.slug) <= 0
                            }
                        >
                          <ChevronUp size={14} />
                        </Button>
                        <Button
                            className="h-4 px-1"
                            size="sm"
                            variant="ghost"
                            title="Move down"
                            onClick={() => handleMoveItem(item.slug, 1)}
                            disabled={
                                reorderingSlug !== null ||
                                isSaving ||
                                orderedPosition(items, item.slug) >=
                                orderedCount(items) - 1
                            }
                        >
                          <ChevronDown size={14} />
                        </Button>
                      </div>
                      <Select
                        value={item.status || "draft"}
                        onValueChange={(v: ExperienceStatus) => {
                          setStatusConfig({ item, newStatus: v });
                          setStatusDialogOpen(true);
                        }}
                      >
                        <SelectTrigger className="h-9 w-[120px]">
                          <span className="text-xs capitalize">
                            {item.status || "draft"}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.filter(
                            (o) => o.value !== item.status,
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
                        onClick={() => handleEdit(item)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        className="h-9 px-2 text-red-600 hover:text-red-700 hover:border-red-600"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setItemToDelete(item.slug);
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
        title="Change Experience Status"
        description={`Change "${statusConfig.item?.role} @ ${statusConfig.item?.company}" to ${statusConfig.newStatus}?`}
        confirmText="Update Status"
        cancelText="Cancel"
        onConfirm={handleConfirmStatusChange}
        variant="default"
        loading={isChangingStatus}
      />
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Experience"
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
