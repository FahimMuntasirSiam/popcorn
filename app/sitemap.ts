import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase-server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://popcorn.example.com'

  // Fetch all published posts
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, category, updated_at')
    .eq('status', 'published')

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trailers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  const dynamicPages: MetadataRoute.Sitemap = (posts || []).map((post) => {
    let priority = 0.8
    if (post.category === 'trailers') priority = 0.7

    return {
      url: `${baseUrl}/${post.category}/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: 'weekly',
      priority: priority,
    }
  })

  return [...staticPages, ...dynamicPages]
}
