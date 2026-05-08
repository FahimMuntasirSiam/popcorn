import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Helper to get service role client for admin operations
const getServiceSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};

// Helper to get public client for reads
const getPublicSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export async function GET() {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from('languages')
    .select('id, name, slug, flag, sort_order, is_active')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, {
    status: 200,
    headers: {
      'Cache-Control': 's-maxage=300, stale-while-revalidate',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, flag, sort_order } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    
    // Check if slug exists
    const { data: existing } = await supabase
      .from('languages')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('languages')
      .insert([
        {
          name,
          slug: slug.toLowerCase(),
          flag,
          sort_order: sort_order || 0,
          is_active: true
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, language: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, slug, flag, is_active, sort_order } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('languages')
      .update({
        name,
        slug: slug?.toLowerCase(),
        flag,
        is_active,
        sort_order
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, language: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Soft delete: sets is_active = false
    const { error } = await supabase
      .from('languages')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
