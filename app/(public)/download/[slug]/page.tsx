import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import DownloadGate from '@/components/interactions/DownloadGate'

interface DownloadPageProps {
  params: {
    slug: string
  }
  searchParams: {
    link?: string
  }
}

export default async function DownloadPage({ params, searchParams }: DownloadPageProps) {
  const supabase = createClient()
  const linkSlug = searchParams.link

  if (!linkSlug) {
    notFound()
  }

  // 1. Fetch current movie
  const { data: movie } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!movie) {
    notFound()
  }

  // 2. Fetch related movies (same category, excluding current)
  const { data: relatedMovies } = await supabase
    .from('posts')
    .select('*')
    .eq('category', movie.category)
    .neq('id', movie.id)
    .limit(4)

  return (
    <DownloadGate 
      movie={movie} 
      linkSlug={linkSlug} 
      relatedMovies={relatedMovies || []} 
    />
  )
}