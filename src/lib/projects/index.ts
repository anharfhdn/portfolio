import { supabase } from "@/lib/supabaseClient";

export type SupabaseProject = {
  id?: string;
  title: string;
  slug: string;
  client?: string;
  description?: string;
  image?: string;
  tags?: string[];
  link?: string;
  confidential?: boolean;
  display_order?: number;
  status?: "draft" | "published" | "archived";
  date?: string;
  created_at?: string;
  updated_at?: string;
};

function normalize(row: any): SupabaseProject {
  return {
    ...row,
    tags: Array.isArray(row.tags) ? row.tags : [],
    confidential: row.confidential ?? row.link === "#",
  } as SupabaseProject;
}

export async function getAllProjects(): Promise<SupabaseProject[]> {
  try {
    const res = await fetch("/api/projects", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error(
        `Failed to fetch projects (GET /api/projects → ${res.status}):`,
        await res.text(),
      );
      return [];
    }

    const data = await res.json();
    return ((data.data ?? []) as any[]).map(normalize);
  } catch (err) {
    console.error("Error getting projects:", err);
    return [];
  }
}

export async function getAllProjectsAdmin(): Promise<SupabaseProject[]> {
  try {
    const res = await fetch(`/api/projects?admin=true`, {
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
        `Failed to fetch admin projects (GET /api/projects → ${res.status}):`,
        await res.text(),
      );
      return [];
    }

    const data = await res.json();
    return ((data.data ?? []) as any[]).map(normalize);
  } catch (err) {
    console.error("Error getting admin projects:", err);
    return [];
  }
}

export async function getProjectsCountAdmin(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Supabase read error:", error);
      return 0;
    }

    return count ?? 0;
  } catch (err) {
    console.error("Error getting projects count from Supabase:", err);
    return 0;
  }
}

export async function saveProject(
  project: SupabaseProject,
): Promise<SupabaseProject | null> {
  try {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projects: [project] }),
    });

    if (!res.ok) {
      console.error("Failed to save project via API:", await res.text());
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
    console.error("Error saving project:", err);
    return null;
  }
}

export async function deleteProject(
  slug: string,
  permanent: boolean = true,
): Promise<boolean> {
  try {
    const res = await fetch(
      `/api/projects?slug=${encodeURIComponent(slug)}&permanent=${permanent}`,
      {
        method: "DELETE",
      },
    );
    if (!res.ok) {
      console.error("Failed to delete project via API:", await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error deleting project:", err);
    return false;
  }
}

export type ProjectStatus = "draft" | "published" | "archived";

export async function projectVisibility(
  slug: string,
  status: ProjectStatus,
): Promise<boolean> {
  try {
    const actionMap: Record<ProjectStatus, string> = {
      draft: "draft",
      published: "publish",
      archived: "archive",
    };

    const action = actionMap[status] || status;

    const res = await fetch("/api/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        slug,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Failed to set project to ${status}:`, errorText);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Error setting project to ${status}:`, err);
    return false;
  }
}
