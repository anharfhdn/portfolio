import { supabase } from "@/lib/supabaseClient";

export type SupabaseSkill = {
  id?: string;
  title: string;
  slug: string;
  skill_group?: string;
  items?: string[];
  icons?: string[];
  display_order?: number;
  status?: "draft" | "published" | "archived";
  created_at?: string;
  updated_at?: string;
};

function normalize(row: any): SupabaseSkill {
  return {
    ...row,
    items: Array.isArray(row.items) ? row.items : [],
    icons: Array.isArray(row.icons) ? row.icons : [],
  } as SupabaseSkill;
}

export async function getAllSkills(): Promise<SupabaseSkill[]> {
  try {
    const res = await fetch("/api/skills", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error(
        `Failed to fetch skills (GET /api/skills → ${res.status}):`,
        await res.text(),
      );
      return [];
    }

    const data = await res.json();
    return ((data.data ?? []) as any[]).map(normalize);
  } catch (err) {
    console.error("Error getting skills:", err);
    return [];
  }
}

export async function getAllSkillsAdmin(): Promise<SupabaseSkill[]> {
  try {
    const res = await fetch(`/api/skills?admin=true`, {
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
        `Failed to fetch admin skills (GET /api/skills → ${res.status}):`,
        await res.text(),
      );
      return [];
    }

    const data = await res.json();
    return ((data.data ?? []) as any[]).map(normalize);
  } catch (err) {
    console.error("Error getting admin skills:", err);
    return [];
  }
}

export async function getSkillsCountAdmin(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("skills")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Supabase read error:", error);
      return 0;
    }

    return count ?? 0;
  } catch (err) {
    console.error("Error getting skills count from Supabase:", err);
    return 0;
  }
}

export async function saveSkill(
  skill: SupabaseSkill,
): Promise<SupabaseSkill | null> {
  try {
    const res = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills: [skill] }),
    });

    if (!res.ok) {
      console.error("Failed to save skill via API:", await res.text());
      return null;
    }

    const data = await res.json();
    const out =
      Array.isArray(data?.data) && data.data.length > 0
        ? (data.data[0] as any)
        : null;
    if (!out) return null;
    return normalize(out);
  } catch (err) {
    console.error("Error saving skill:", err);
    return null;
  }
}

export async function deleteSkill(
  slug: string,
  permanent: boolean = true,
): Promise<boolean> {
  try {
    const res = await fetch(
      `/api/skills?slug=${encodeURIComponent(slug)}&permanent=${permanent}`,
      {
        method: "DELETE",
      },
    );
    if (!res.ok) {
      console.error("Failed to delete skill via API:", await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error deleting skill:", err);
    return false;
  }
}

export type SkillStatus = "draft" | "published" | "archived";

export async function skillVisibility(
  slug: string,
  status: SkillStatus,
): Promise<boolean> {
  try {
    const actionMap: Record<SkillStatus, string> = {
      draft: "draft",
      published: "publish",
      archived: "archive",
    };

    const action = actionMap[status] || status;

    const res = await fetch("/api/skills", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        slug,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Failed to set skill to ${status}:`, errorText);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Error setting skill to ${status}:`, err);
    return false;
  }
}
