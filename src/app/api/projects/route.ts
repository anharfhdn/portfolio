import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

async function adminClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env",
    );
  }
  return await getSupabaseAdmin();
}

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify({ data }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function jsonError(message: string, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function isAdminRequest(req: Request): boolean {
  const referer = req.headers.get("referer") || "";
  const url = new URL(req.url);
  return referer.includes("/admin") || url.pathname.includes("/api/admin");
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    const isAdmin =
      url.searchParams.get("admin") === "true" || isAdminRequest(req);

    const supabaseAdmin = await adminClient();
    let query = supabaseAdmin.from("projects").select("*");

    if (slug) {
      query = query.eq("slug", slug);
    } else if (!isAdmin) {
      query = query.eq("status", "published");
    }

    const { data, error } = await query
      .order("display_order", { ascending: true })
      .order("date", { ascending: false });

    if (error) return jsonError(error.message, 500);
    return jsonResponse(data ?? [], 200);
  } catch (err: any) {
    return jsonError(err.message || "Unknown error", 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let projects = body?.projects ?? body?.project ?? body;

    if (!projects) {
      return jsonError("Missing project(s) in request body", 400);
    }

    if (!Array.isArray(projects)) projects = [projects];

    const allowedCols = [
      "id",
      "title",
      "slug",
      "client",
      "description",
      "image",
      "tags",
      "link",
      "confidential",
      "display_order",
      "status",
      "date",
      "created_at",
      "updated_at",
      "owner",
    ];

    const prepared = projects.map((p: any) => {
      const out: any = {};
      out.status = p.status || "draft";
      out.confidential = p.confidential ?? p.link === "#";
      if (out.confidential && !p.link) out.link = "#";

      for (const col of allowedCols) {
        if (col === "status" || col === "confidential") continue;
        if (col === "created_at") {
          out.created_at = p.created_at ?? new Date().toISOString();
          continue;
        }
        if (col === "updated_at") {
          out.updated_at = new Date().toISOString();
          continue;
        }
        if (p[col] !== undefined) out[col] = p[col];
      }
      return out;
    });

    const supabaseAdmin = await adminClient();
    const { data, error } = await supabaseAdmin
      .from("projects")
      .upsert(prepared, { onConflict: "slug" })
      .select();
    if (error) return jsonError(error.message, 500);

    return jsonResponse(data ?? [], 200);
  } catch (err) {
    return jsonError((err as any).message || "Unknown error", 500);
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { slug, updates, action } = body;

    if (
      action &&
      ["archive", "unarchive", "publish", "draft"].includes(action)
    ) {
      if (!slug) return jsonError("slug required for status change", 400);

      const supabaseAdmin = await adminClient();

      let newStatus: string;
      switch (action) {
        case "archive":
          newStatus = "archived";
          break;
        case "unarchive":
          newStatus = "published";
          break;
        case "publish":
          newStatus = "published";
          break;
        case "draft":
          newStatus = "draft";
          break;
        default:
          newStatus = "draft";
      }

      const { data, error } = await supabaseAdmin
        .from("projects")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("slug", slug)
        .select()
        .single();

      if (error) return jsonError(error.message, 500);
      return jsonResponse(data ?? null, 200);
    }

    if (!slug || !updates) return jsonError("slug and updates required", 400);

    const supabaseAdmin = await adminClient();
    const normalizedUpdates: any = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("projects")
      .update(normalizedUpdates)
      .eq("slug", slug)
      .select()
      .single();

    if (error) return jsonError(error.message, 500);
    return jsonResponse(data ?? null, 200);
  } catch (err) {
    return jsonError((err as any).message || "Unknown error", 500);
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    const permanent = url.searchParams.get("permanent") === "true";

    if (!slug) return jsonError("slug query param required", 400);

    const supabaseAdmin = await adminClient();

    if (permanent) {
      const { error } = await supabaseAdmin
        .from("projects")
        .delete()
        .eq("slug", slug);
      if (error) return jsonError(error.message, 500);
      return jsonResponse({ ok: true }, 200);
    } else {
      const { data, error } = await supabaseAdmin
        .from("projects")
        .update({
          status: "archived",
          updated_at: new Date().toISOString(),
        })
        .eq("slug", slug)
        .select()
        .single();

      if (error) return jsonError(error.message, 500);
      return jsonResponse(data ?? null, 200);
    }
  } catch (err) {
    return jsonError((err as any).message || "Unknown error", 500);
  }
}
