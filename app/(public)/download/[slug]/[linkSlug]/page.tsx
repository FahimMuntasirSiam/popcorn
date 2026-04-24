import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import DownloadGateClient from '@/app/(public)/download/[slug]/[linkSlug]/DownloadGateClient'
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

  // Fetch recommendations (same language, excluding current)
  const { data: recommendations } = await supabase
    .from('posts')
    .select('*')
    .eq('language_tag', post.language_tag)
    .eq('status', 'published')
    .neq('id', post.id)
    .limit(4)

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white pt-24 pb-20 px-4">
      <div className="max-w-[480px] mx-auto space-y-12">
        
        {/* The interactive countdown and download logic */}
        <DownloadGateClient 
          post={post} 
          link={link} 
          slug={params.slug} 
          linkSlug={params.linkSlug} 
        />

        {/* Recommendations Section */}
        {recommendations && recommendations.length > 0 && (
          <div className="space-y-6 pt-12 border-t border-white/5">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-popcorn-secondary text-center">
              More movies you might like
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {recommendations.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
