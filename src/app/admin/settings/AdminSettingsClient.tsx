"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { Home, Computer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  getSiteSettings,
  saveSettings,
  DEFAULT_SETTINGS,
  type SiteSettings,
} from "@/lib/settings";
import { toast } from "sonner";

const FIELDS: {
  key: keyof SiteSettings;
  label: string;
  multiline?: boolean;
  type?: string;
}[] = [
  { key: "profile_name", label: "Profile Name" },
  { key: "meta_title", label: "Meta Title" },
  { key: "meta_description", label: "Meta Description", multiline: true },
  { key: "availability_badge", label: "Availability Badge" },
  { key: "contact_email", label: "Contact Email" },
  { key: "contact_intro", label: "Contact Intro (HTML allowed)", multiline: true },
  { key: "location_city", label: "Location City" },
  { key: "location_mode", label: "Location Mode" },
  { key: "focus_title", label: "Focus Title" },
  { key: "social_github", label: "GitHub URL" },
  { key: "social_linkedin", label: "LinkedIn URL" },
  { key: "social_instagram", label: "Instagram URL" },
  { key: "hero_title_line1", label: "Hero Title Line 1" },
  { key: "hero_title_line2", label: "Hero Title Line 2" },
  { key: "hero_bio", label: "Hero Bio (HTML, {{years}} = experience)", multiline: true },
  { key: "career_start", label: "Career Start (month)", type: "month" },
  { key: "about_title_line1", label: "About Title Line 1" },
  { key: "about_title_line2", label: "About Title Line 2" },
  { key: "about_bio", label: "About Bio (HTML, {{years}} = experience)", multiline: true },
];

export default function AdminSettingsClient({
  adminAddresses,
}: {
  adminAddresses: string[];
}) {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [categories, setCategories] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
          const remote = await getSiteSettings();
          setFormData(remote);
          setCategories((remote.blog_categories || []).join(", "));
        } catch (e) {
          console.warn("Failed to load settings from Supabase", e);
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const blog_categories = categories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      const ok = await saveSettings({ ...formData, blog_categories });
      toast(ok ? "Success" : "Error", {
        description: ok
          ? "Settings saved successfully"
          : "Failed to save settings",
        icon: <Computer size={16} className="text-emerald-500" />,
      });
    } catch (error) {
      console.error("Save settings error:", error);
      toast("Error", {
        description: "Failed to save settings",
        icon: <Computer size={16} className="text-emerald-500" />,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-32 pb-24">
          <Card className="w-full max-w-md p-8">
            <div className="text-center space-y-6">
              <h1 className="text-2xl font-bold">Site Settings</h1>
              <p className="text-muted-foreground">
                Please connect your wallet to access site settings.
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
                Your wallet address is not authorized to access site settings.
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow grid-bg pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Site Settings
              </h1>
              <p className="text-muted-foreground">
                Profile, contacts, socials, and blog categories
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isSaving || isLoading}>
                {isSaving ? (
                  <span className="flex items-center">
                    <Spinner className="mr-2 h-4 w-4" />
                    Saving...
                  </span>
                ) : (
                  "Save Settings"
                )}
              </Button>
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <Home size={18} className="mr-2" />
                  Admin Home
                </Button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground animate-pulse">
                Loading settings...
              </p>
            </Card>
          ) : (
            <Card className="p-6">
              <div className="grid gap-6">
                {FIELDS.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key}>{field.label}</Label>
                    {field.multiline ? (
                      <Textarea
                        id={field.key}
                        value={formData[field.key] as string}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.key]: e.target.value,
                          })
                        }
                        disabled={isSaving}
                      />
                    ) : (
                      <Input
                        id={field.key}
                        type={field.type ?? "text"}
                        value={formData[field.key] as string}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.key]: e.target.value,
                          })
                        }
                        disabled={isSaving}
                      />
                    )}
                  </div>
                ))}

                <div className="space-y-2">
                  <Label htmlFor="blog_categories">
                    Blog Categories (comma separated)
                  </Label>
                  <Textarea
                    id="blog_categories"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    disabled={isSaving}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
