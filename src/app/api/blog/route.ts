import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

async function adminClient() {
  return await getSupabaseAdmin();
}

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify({ data }), { status, headers: { 'Content-Type': 'application/json' } });
}

function jsonError(message: string, status = 500) {
  return new Response(JSON.stringify({ error: message }), { status, headers: { 'Content-Type': 'application/json' } });
}

export async function GET() {
  try {
    const supabaseAdmin = await adminClient();
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      return jsonError(error.message, 500);
    }
    return jsonResponse(data ?? [], 200);
  } catch (err) {
    return jsonError((err as any).message || 'Unknown error', 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let posts = body?.posts ?? body?.post ?? body;

    if (!posts) {
      return jsonError('Missing post(s) in request body', 400);
    }

    if (!Array.isArray(posts)) posts = [posts];

    const allowedCols = [
      'id',
      'title',
      'slug',
      'date',
      'excerpt',
      'content',
      'markdown',
      'author',
      'read_time',
      'category',
      'image',
      'created_at',
      'updated_at',
      'owner',
    ];

    const prepared = posts.map((p: any) => {
      const out: any = {};
      out.read_time = p.readTime ?? p.read_time ?? null;
      for (const col of allowedCols) {
        if (col === 'read_time') continue;
        if (col === 'created_at') {
          out.created_at = p.created_at ?? new Date().toISOString();
          continue;
        }
        if (col === 'updated_at') {
          out.updated_at = new Date().toISOString();
          continue;
        }
        if (p[col] !== undefined) out[col] = p[col];
      }
      return out;
    });

    const supabaseAdmin = await adminClient();
    const { data, error } = await supabaseAdmin.from('posts').upsert(prepared, { onConflict: 'slug' }).select();
    if (error) return jsonError(error.message, 500);

    return jsonResponse(data ?? [], 200);
  } catch (err) {
    return jsonError((err as any).message || 'Unknown error', 500);
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { slug, updates } = body;
    if (!slug || !updates) return jsonError('slug and updates required', 400);

    const supabaseAdmin = await adminClient();
    const normalizedUpdates: any = { ...updates };
    if ((normalizedUpdates as any).readTime !== undefined) {
      normalizedUpdates.read_time = (normalizedUpdates as any).readTime;
      delete (normalizedUpdates as any).readTime;
    }
    const { data, error } = await supabaseAdmin
      .from('posts')
      .update({ ...normalizedUpdates, updated_at: new Date().toISOString() })
      .eq('slug', slug)
      .select()
      .single();

    if (error) return jsonError(error.message, 500);
    return jsonResponse(data ?? null, 200);
  } catch (err) {
    return jsonError((err as any).message || 'Unknown error', 500);
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');
    if (!slug) return jsonError('slug query param required', 400);

    const supabaseAdmin = await adminClient();
    const { error } = await supabaseAdmin.from('posts').delete().eq('slug', slug);
    if (error) return jsonError(error.message, 500);
    return jsonResponse({ ok: true }, 200);
  } catch (err) {
    return jsonError((err as any).message || 'Unknown error', 500);
  }
}