import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { postSlug, linkSlug, token, timestamp } = await req.json()
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'

    // 1. Basic Validation
    if (!token || !postSlug || !linkSlug || !timestamp) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 403 })
    }

    // 2. Timing Validation (at least 14 seconds)
    const now = Date.now()
    const elapsed = now - timestamp
    if (elapsed < 14000) {
      return NextResponse.json({ error: 'Too fast. Please wait for the timer.' }, { status: 403 })
    }

    // 3. Rate Limiting (5 per hour per IP)
    const supabase = createClient()
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
    
    const { count, error: countError } = await supabase
      .from('downloads_log')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gt('created_at', oneHourAgo)

    if (countError) throw countError
    if (count !== null && count >= 5) {
      return NextResponse.json({ error: 'Too many requests. Try again in an hour.' }, { status: 429 })
    }

    // 4. Fetch Post & Link Data
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id, download_links')
      .eq('slug', postSlug)
      .single()

    if (postError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const downloadLinks = post.download_links as any[]
    const link = downloadLinks?.find((l: any) => l.slug === linkSlug)
    
    if (!link || !link.telegram_url) {
      return NextResponse.json({ error: 'Download link not configured' }, { status: 404 })
    }

    const downloadUrl = link.telegram_url

    // 5. Log the download
    await supabase.from('downloads_log').insert({
      post_slug: postSlug,
      link_slug: linkSlug,
      ip_address: ip
    })

    return NextResponse.json({ url: downloadUrl })

  } catch (err: any) {
    console.error('Download API Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
