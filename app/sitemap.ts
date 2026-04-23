import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase-server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()
  const baseUrl = 'https://popcorn.com' // Replace with your production URL

  // Fetch all published posts
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at, category')
    .eq('status', 'published')

  const postEntries: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${baseUrl}/${post.category.includes('blog') || post.category.includes('news') ? 'blog' : 'movies'}/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/category/movies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  return [...staticEntries, ...postEntries]
}
