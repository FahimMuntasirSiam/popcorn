import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import DownloadGateClient from './DownloadGateClient'
import MovieCard from '@/components/cards/MovieCard'

export default async function DownloadGatePage({ 
  params 
}: { 
  params: { slug: string, linkSlug: string } 
}) {
  const supabase = createClient()
  
  // Fetch post data
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!post) notFound()

  // Find the specific link
  const link = post.download_links?.find((l: any) => l.slug === params.linkSlug)
  if (!link) notFound()

  // Sanitize for client
  const sanitizedPost = {
    ...post,
    download_links: post.download_links?.map((l: any) => ({
      label: l.label,
      quality: l.quality,
      size: l.size,
      slug: l.slug
    }))
  }

  const sanitizedLink = {
    label: link.label,
    quality: link.quality,
    size: link.size,
    slug: link.slug
  }

  // Fetch 4 recommendations
  const { data: recommendations } = await supabase
    .from('posts')
    .select('*')
    .eq('language_tag', post.language_tag)
    .eq('status', 'published')
    .neq('id', post.id)
    .limit(4)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white pt-16">
      {/* The main interactive section */}
      <DownloadGateClient 
        post={sanitizedPost as any} 
        link={sanitizedLink as any} 
        slug={params.slug} 
        linkSlug={params.linkSlug} 
      />

      {/* Recommendations Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
        <h3 className="text-[12px] font-bold uppercase tracking-[3px] text-[#666] mb-10">
          More movies you might like
        </h3>
        <div className="flex flex-wrap gap-6 justify-center">
          {recommendations?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} variant="fixed" />
          ))}
        </div>
      </div>
    </div>
  )
}
