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

function isAdminRequest(req: Request): boolean {
  const referer = req.headers.get('referer') || '';
  const url = new URL(req.url);
  return referer.includes('/admin') || url.pathname.includes('/api/admin');}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const showArchived = url.searchParams.get('archived') === 'true';
    const slug = url.searchParams.get('slug');
    const admin = url.searchParams.get('admin') === 'true';

    const supabaseAdmin = await adminClient();
    let query = supabaseAdmin.from('posts').select('*');

    if (slug) {
      query = query.eq('slug', slug);
    }
    else if (admin || isAdminRequest(req)) {
      if (!showArchived) {
        query = query.or('status.is.null,status.neq.archived');
      } else {
        query = query.eq('status', 'archived');
      }
    }
    else {
      query = query.eq('status', 'published');
    }

    const { data, error } = await query.order('date', { ascending: false });

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
      'status',
    ];

    const prepared = posts.map((p: any) => {
      const out: any = {};
      out.read_time = p.readTime ?? p.read_time ?? null;
      out.status = p.status || 'draft';

      for (const col of allowedCols) {
        if (col === 'read_time' || col === 'status') continue;
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
    const { slug, updates, action } = body;

    if (action && ['archive', 'unarchive', 'publish', 'draft'].includes(action)) {
      if (!slug) return jsonError('slug required for status change', 400);

      const supabaseAdmin = await adminClient();

      let newStatus: string;
      switch (action) {
        case 'archive':
          newStatus = 'archived';
          break;
        case 'unarchive':
          newStatus = 'published';
          break;
        case 'publish':
          newStatus = 'published';
          break;
        case 'draft':
          newStatus = 'draft';
          break;
        default:
          newStatus = 'draft';
      }

      const { data, error } = await supabaseAdmin
          .from('posts')
          .update({
            status: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('slug', slug)
          .select()
          .single();

      if (error) return jsonError(error.message, 500);
      return jsonResponse(data ?? null, 200);
    }

    if (!slug || !updates) return jsonError('slug and updates required', 400);

    const supabaseAdmin = await adminClient();
    const normalizedUpdates: any = { ...updates };

    if ((normalizedUpdates as any).readTime !== undefined) {
      normalizedUpdates.read_time = (normalizedUpdates as any).readTime;
      delete (normalizedUpdates as any).readTime;
    }

    normalizedUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
        .from('posts')
        .update(normalizedUpdates)
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
    const permanent = url.searchParams.get('permanent') === 'true';

    if (!slug) return jsonError('slug query param required', 400);

    const supabaseAdmin = await adminClient();

    if (permanent) {
      const { error } = await supabaseAdmin.from('posts').delete().eq('slug', slug);
      if (error) return jsonError(error.message, 500);
      return jsonResponse({ ok: true }, 200);
    }
    else {
      const { data, error } = await supabaseAdmin
          .from('posts')
          .update({
            status: 'archived',
            updated_at: new Date().toISOString()
          })
          .eq('slug', slug)
          .select()
          .single();

      if (error) return jsonError(error.message, 500);
      return jsonResponse(data ?? null, 200);
    }
  } catch (err) {
    return jsonError((err as any).message || 'Unknown error', 500);
  }
}