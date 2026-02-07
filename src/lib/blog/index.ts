import { supabase } from '@/lib/supabaseClient';

export type SupabasePost = {
  id?: string;
  title: string;
  slug: string;
  date?: string;
  excerpt?: string;
  content?: string;
  markdown?: string;
  author?: string;
  readTime?: string;
  category?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
};

export async function getAllBlogPosts(): Promise<SupabasePost[]> {
  try {
    const { data, error } = await supabase.from('posts').select('*').order('date', { ascending: false });
    if (error) {
      console.error('Supabase read error:', error);
      return [];
    }
    const normalized = (data ?? []).map((row: any) => ({
      ...row,
      readTime: row.read_time ?? row.readTime ?? undefined,
    }));
    return normalized as SupabasePost[];
  } catch (err) {
    console.error('Error getting posts from Supabase:', err);
    return [];
  }
}

export async function getAllBlogPostsLength(): Promise<number> {
  try {
    const { count, error } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Supabase read error:', error);
      return 0;
    }

    return count ?? 0;
  } catch (err) {
    console.error('Error getting posts count from Supabase:', err);
    return 0;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<SupabasePost | null> {
  try {
    const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).limit(1).single();
    if (error) {
      console.error('Supabase get by slug error:', error);
      return null;
    }
    const row = data as any;
    if (!row) return null;
    row.readTime = row.read_time ?? row.readTime ?? undefined;
    return row as SupabasePost;
  } catch (err) {
    console.error('Error fetching post by slug:', err);
    return null;
  }
}

export async function saveBlogPost(post: SupabasePost): Promise<SupabasePost | null> {
  try {
    const toSend = {
      ...post,
      read_time: (post as any).readTime ?? (post as any).read_time ?? null,
    } as any;
    delete (toSend as any).readTime;

    const res = await fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ posts: [toSend] }),
    });

    if (!res.ok) {
      console.error('Failed to save post via API:', await res.text());
      return null;
    }

    const data = await res.json();
    const out = Array.isArray(data) && data.length > 0 ? (data[0] as any) : null;
    if (!out) return null;
    out.readTime = out.read_time ?? out.readTime ?? undefined;
    return out as SupabasePost;
  } catch (err) {
    console.error('Error saving post:', err);
    return null;
  }
}

export async function deleteBlogPost(slug: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/blog?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' });
    if (!res.ok) {
      console.error('Failed to delete post via API:', await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error deleting post:', err);
    return false;
  }
}
