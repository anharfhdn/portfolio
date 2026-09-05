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

export async function GET() {
  try {
    const supabaseAdmin = await adminClient();
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("*");
    if (error) return jsonError(error.message, 500);
    const settings: Record<string, any> = {};
    for (const row of data ?? []) {
      settings[row.key] = row.value;
    }
    return jsonResponse(settings, 200);
  } catch (err: any) {
    return jsonError(err.message || "Unknown error", 500);
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const entries = Array.isArray(body?.settings)
      ? body.settings
      : body?.key !== undefined
        ? [{ key: body.key, value: body.value }]
        : [];

    if (entries.length === 0) {
      return jsonError("Missing settings in request body", 400);
    }

    const prepared = entries.map((e: any) => ({
      key: e.key,
      value: e.value ?? null,
      updated_at: new Date().toISOString(),
    }));

    const supabaseAdmin = await adminClient();
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .upsert(prepared, { onConflict: "key" })
      .select();
    if (error) return jsonError(error.message, 500);

    return jsonResponse(data ?? [], 200);
  } catch (err) {
    return jsonError((err as any).message || "Unknown error", 500);
  }
}
