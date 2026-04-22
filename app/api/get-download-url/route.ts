import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { postSlug, linkSlug, timestamp } = await request.json()

    // 1. Basic validation
    if (!postSlug || !linkSlug || !timestamp) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    // 2. Validate countdown (15 seconds)
    // We allow 14 seconds as a small buffer for network latency
    const elapsed = Date.now() - timestamp
    if (elapsed < 14000) {
      return NextResponse.json({ error: 'Verification failed: Too fast' }, { status: 403 })
    }

    // 3. Fetch link from database
    const supabase = createRouteHandlerClient({ cookies })
    const { data: post, error } = await supabase
      .from('posts')
      .select('download_links')
      .eq('slug', postSlug)
      .single()

    if (error || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // 4. Find the specific link by slug
    const links = (post.download_links || []) as any[]
    const targetLink = links.find((l: any) => l.slug === linkSlug)

    if (!targetLink) {
      return NextResponse.json({ error: 'Download link not found' }, { status: 404 })
    }

    // 5. Return the protected URL
    return NextResponse.json({ url: targetLink.url })

  } catch (err) {
    console.error('Download API error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
