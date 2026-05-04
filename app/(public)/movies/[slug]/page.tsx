import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { Metadata } from 'next'
import MovieDetailClient from '@/components/movies/MovieDetailClient'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient()
  const { data: post } = await supabase.from('posts').select('*').eq('slug', params.slug).single()

  if (!post) return { title: 'Not Found | Popcorn' }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://popcorn.example.com'
  const fullUrl = `${baseUrl}/${post.category}/${post.slug}`
  const title = `${post.title} | Popcorn`
  const description = post.meta_description || post.content?.substring(0, 160) || ''

  return {
    title,
    description,
    keywords: `${post.title}, ${post.genre}, ${post.language_tag}, download, movie`,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'Popcorn',
      images: post.cover_image ? [
        {
          url: post.cover_image,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
      locale: 'en_US',
      type: 'video.movie',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.cover_image ? [post.cover_image] : [],
    },
    alternates: {
      canonical: fullUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  }
}

export default async function MovieDetailPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const supabase = createClient()
  
  const { data: movie } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!movie) {
    notFound()
  }

  const getYoutubeId = (url: string | null) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const videoId = getYoutubeId(movie.trailer_url)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://popcorn.example.com'
  const fullUrl = `${baseUrl}/${movie.category}/${movie.slug}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "description": movie.meta_description,
    "image": movie.cover_image,
    "datePublished": movie.created_at,
    "inLanguage": movie.language_tag,
    "genre": movie.genre,
    "url": fullUrl,
    "aggregateRating": movie.imdb_rating ? {
      "@type": "AggregateRating",
      "ratingValue": movie.imdb_rating,
      "reviewCount": movie.total_reviews || 1,
    } : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MovieDetailClient movie={movie} videoId={videoId} />
    </>
  )
}