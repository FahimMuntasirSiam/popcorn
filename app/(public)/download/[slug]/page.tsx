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
  const linkSlug = params.slug

  // 1. Fetch movie that contains this link slug
  const { data: movie } = await supabase
    .from('posts')
    .select('*')
    .contains('download_links', [{ slug: linkSlug }])
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

  // 3. SECURE: Remove URLs from download links before passing to Client Component
  const safeMovie = {
    ...movie,
    download_links: (movie.download_links || []).map(({ url, ...rest }: any) => rest)
  }

  return (
    <DownloadGate 
      movie={safeMovie as any} 
      linkSlug={linkSlug} 
      relatedMovies={relatedMovies || []} 
    />
  )
}