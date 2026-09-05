import { supabase } from "@/lib/supabaseClient";

export type SupabaseExperience = {
  id?: string;
  slug: string;
  company: string;
  role: string;
  period?: string;
  description?: string;
  location?: string;
  display_order?: number;
  status?: "draft" | "published" | "archived";
  created_at?: string;
  updated_at?: string;
};

export async function getAllExperience(): Promise<SupabaseExperience[]> {
  try {
    const res = await fetch("/api/experience", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error(
        `Failed to fetch experience (GET /api/experience → ${res.status}):`,
        await res.text(),
      );
      return [];
    }

    const data = await res.json();
    return (data.data ?? []) as SupabaseExperience[];
  } catch (err) {
    console.error("Error getting experience:", err);
    return [];
  }
}

export async function getAllExperienceAdmin(): Promise<SupabaseExperience[]> {
  try {
    const res = await fetch(`/api/experience?admin=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Referer:
          typeof window !== "undefined"
            ? window.location.origin + "/admin"
            : "",
      },
    });

    if (!res.ok) {
      console.error(
        `Failed to fetch admin experience (GET /api/experience → ${res.status}):`,
        await res.text(),
      );
      return [];
    }

    const data = await res.json();
    return (data.data ?? []) as SupabaseExperience[];
  } catch (err) {
    console.error("Error getting admin experience:", err);
    return [];
  }
}

export async function getExperienceCountAdmin(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("experience")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Supabase read error:", error);
      return 0;
    }

    return count ?? 0;
  } catch (err) {
    console.error("Error getting experience count from Supabase:", err);
    return 0;
  }
}

export async function saveExperience(
  item: SupabaseExperience,
): Promise<SupabaseExperience | null> {
  try {
    const res = await fetch("/api/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experience: [item] }),
    });

    if (!res.ok) {
      console.error("Failed to save experience via API:", await res.text());
      return null;
    }

    const data = await res.json();
    const out =
      Array.isArray(data?.data) && data.data.length > 0
        ? (data.data[0] as SupabaseExperience)
        : null;
    return out;
  } catch (err) {
    console.error("Error saving experience:", err);
    return null;
  }
}

export async function deleteExperience(
  slug: string,
  permanent: boolean = true,
): Promise<boolean> {
  try {
    const res = await fetch(
      `/api/experience?slug=${encodeURIComponent(slug)}&permanent=${permanent}`,
      {
        method: "DELETE",
      },
    );
    if (!res.ok) {
      console.error("Failed to delete experience via API:", await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error deleting experience:", err);
    return false;
  }
}

export type ExperienceStatus = "draft" | "published" | "archived";

export async function experienceVisibility(
  slug: string,
  status: ExperienceStatus,
): Promise<boolean> {
  try {
    const actionMap: Record<ExperienceStatus, string> = {
      draft: "draft",
      published: "publish",
      archived: "archive",
    };

    const action = actionMap[status] || status;

    const res = await fetch("/api/experience", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        slug,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Failed to set experience to ${status}:`, errorText);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Error setting experience to ${status}:`, err);
    return false;
  }
}
