import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://popcorn.example.com'

  // Fetch posts from last 48 hours
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()

  const { data: posts } = await supabase
    .from('posts')
    .select('title, slug, category, created_at, cover_image')
    .eq('status', 'published')
    .gte('created_at', fortyEightHoursAgo)
    .in('category', ['movies', 'blogs', 'trailers'])
    .order('created_at', { ascending: false })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${(posts || [])
    .map((post) => {
      const fullUrl = `${baseUrl}/${post.category}/${post.slug}`
      return `
  <url>
    <loc>${fullUrl}</loc>
    <news:news>
      <news:publication>
        <news:name>Popcorn</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(post.created_at).toISOString()}</news:publication_date>
      <news:title>${escapeXml(post.title)}</news:title>
    </news:news>
    ${post.cover_image ? `
    <image:image>
      <image:loc>${post.cover_image}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
    </image:image>` : ''}
  </url>`
    })
    .join('')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}
