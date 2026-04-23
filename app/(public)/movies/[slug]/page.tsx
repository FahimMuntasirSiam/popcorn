import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Calendar, Download, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { DownloadLink } from '@/types'
import CommentSection from '@/components/interactions/CommentSection'
import ReviewSection from '@/components/interactions/ReviewSection'
import AdUnit from '@/components/ui/AdUnit'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient()
  const { data: movie } = await supabase.from('posts').select('*').eq('slug', params.slug).single()

  if (!movie) return { title: 'Not Found | Popcorn' }

  const title = `${movie.title} | Popcorn`
  const description = movie.meta_description || movie.content?.substring(0, 160) || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: movie.cover_image ? [{ url: movie.cover_image }] : [],
      type: 'video.movie',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: movie.cover_image ? [movie.cover_image] : [],
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

  // Extract YouTube ID from URL if exists
  const getYoutubeId = (url: string | null) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const videoId = getYoutubeId(movie.trailer_url)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.meta_description,
    image: movie.cover_image,
    datePublished: movie.created_at,
    aggregateRating: movie.avg_rating ? {
      '@type': 'AggregateRating',
      ratingValue: movie.avg_rating,
      reviewCount: movie.total_reviews || 1,
    } : undefined,
  }

  return (
    <div className="bg-popcorn-dark min-h-screen text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Header with Backdrop */}
      <div className="relative w-full h-[60vh] md:h-[70vh]">
        <div className="absolute inset-0">
          {movie.cover_image && (
            <Image
              src={movie.cover_image}
              alt={movie.title}
              fill
              className="object-cover opacity-30"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-popcorn-dark via-popcorn-dark/80 to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 pt-20 flex flex-col md:flex-row items-end pb-12 gap-8">
          <div className="relative w-48 md:w-64 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 shrink-0 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
            {movie.cover_image && (
                <Image
                  src={movie.cover_image}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
            )}
          </div>
          
          <div className="space-y-4 pb-4">
             <div className="flex flex-wrap gap-2">
                <span className="bg-popcorn-red text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  {movie.category.replace('-', ' ')}
                </span>
                <span className="bg-white/10 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/10 backdrop-blur-sm">
                  {movie.language_tag}
                </span>
             </div>
             
             <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-none drop-shadow-2xl">{movie.title}</h1>
             
             <div className="flex items-center space-x-6 text-sm text-popcorn-secondary font-bold">
                <div className="flex items-center space-x-2 bg-black/40 px-4 py-2 rounded-full border border-white/5">
                   <Star size={16} className="fill-popcorn-gold text-popcorn-gold" />
                   <span className="text-white text-lg italic">{movie.avg_rating?.toFixed(1) || '0.0'}</span>
                   <span className="text-xs text-neutral-500 uppercase tracking-widest ml-1">({movie.total_reviews || 0} Votes)</span>
                </div>
                <div className="flex items-center space-x-2">
                   <Calendar size={18} className="text-popcorn-red" />
                   <span className="uppercase tracking-widest text-xs">{new Date(movie.created_at).getFullYear()}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          {/* Quick Actions / Rating */}
          <section className="bg-popcorn-card/20 p-8 rounded-3xl border border-white/5 shadow-inner">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                   <h3 className="text-sm font-black uppercase tracking-[0.2em] text-popcorn-red">Rate this movie</h3>
                   <ReviewSection postId={movie.id} />
                </div>
                <div className="h-12 w-px bg-white/5 hidden md:block" />
                <div className="flex space-x-3">
                   <button className="bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/10 transition-all group">
                      <Download size={20} className="group-hover:scale-110 transition-transform" />
                   </button>
                   <button className="bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/10 transition-all group">
                      <Star size={20} className="group-hover:scale-110 transition-transform" />
                   </button>
                </div>
             </div>
          </section>

          {/* Storyline */}
          <section className="space-y-6">
             <div className="flex items-center space-x-4">
                <h2 className="text-3xl font-black uppercase tracking-tight">Storyline</h2>
                <div className="h-1 flex-1 bg-gradient-to-r from-popcorn-red/50 to-transparent rounded-full" />
             </div>
             <p className="text-gray-400 leading-relaxed text-xl font-medium">
               {movie.content || movie.meta_description}
             </p>
          </section>

          {/* Trailer */}
          {videoId && (
            <section className="space-y-4">
               <h2 className="text-2xl font-bold border-l-4 border-popcorn-red pl-4">Official Trailer</h2>
               <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                 <iframe
                   className="absolute inset-0 w-full h-full"
                   src={`https://www.youtube.com/embed/${videoId}`}
                   title={`${movie.title} Trailer`}
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                 />
               </div>
            </section>
          )}

          {/* Comments Section */}
          <AdUnit type="banner" position="movie_after_trailer" />
          <CommentSection postId={movie.id} />
        </div>

         {/* Sidebar */}
         <div className="space-y-8">
           {movie.download_links && movie.download_links.length > 0 && (
             <section className="bg-popcorn-card p-6 rounded-xl border border-white/5 space-y-6">
                <h3 className="text-xl font-bold flex items-center space-x-2">
                  <Download size={20} className="text-popcorn-red" />
                  <span>Download Links</span>
                </h3>
                <AdUnit type="sidebar" position="movie_sidebar_top" />
                
                <div className="space-y-3">
                   {movie.download_links.map((link: DownloadLink, i: number) => (
                     <Link 
                       key={i}
                       href={`/download/${link.slug}`}
                       className="w-full flex items-center justify-between bg-white/5 hover:bg-popcorn-red group p-4 rounded-lg transition-all border border-white/5"
                     >
                        <span className="font-bold group-hover:text-white">{link.label || 'Download Now'}</span>
                        <span className="text-xs text-popcorn-secondary group-hover:text-white/80">{link.quality || 'HD'}</span>
                     </Link>
                   ))}
                </div>
             </section>
           )}

           <section className="bg-popcorn-card p-6 rounded-xl border border-white/5 space-y-4 text-sm">

           <section className="bg-popcorn-card p-6 rounded-xl border border-white/5 space-y-4 text-sm">
              <h3 className="font-bold text-white uppercase tracking-wider text-xs">Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-popcorn-secondary">Language</span>
                  <span className="text-white capitalize">{movie.language_tag}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-popcorn-secondary">Category</span>
                  <span className="text-white capitalize">{movie.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-popcorn-secondary">Status</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] uppercase">{movie.status}</span>
                </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  )
}