import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Calendar, Download, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { DownloadLink } from '@/types'
import CommentSection from '@/components/interactions/CommentSection'
import ReviewSection from '@/components/interactions/ReviewSection'
import BookmarkButton from '@/components/interactions/BookmarkButton'
import AdUnit from '@/components/ui/AdUnit'
import { Metadata } from 'next'

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

  // Extract YouTube ID from URL if exists
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
    "aggregateRating": movie.avg_rating ? {
      "@type": "AggregateRating",
      "ratingValue": movie.avg_rating,
      "reviewCount": movie.total_reviews || 1,
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
          <div className="relative w-48 md:w-64 rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 shrink-0 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
            {movie.cover_image && (
                <img
                  src={movie.cover_image}
                  alt={movie.title}
                  className="w-full h-auto"
                />
            )}
          </div>
          
          <div className="space-y-4 pb-4 w-full">
             <div className="flex flex-wrap gap-2">
                <span className="bg-popcorn-red text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  {movie.category}
                </span>
                <span className="bg-white/10 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/10 backdrop-blur-sm">
                  {movie.language_tag}
                </span>
                {movie.genre && (
                  <span className="bg-white/10 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/10 backdrop-blur-sm">
                    {movie.genre}
                  </span>
                )}
             </div>
             
             <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-none drop-shadow-2xl">{movie.title}</h1>
             
             <div className="flex items-center space-x-6 text-sm text-popcorn-secondary font-bold">
                <div className="flex items-center space-x-4">
                   {movie.imdb_rating > 0 && (
                     <div className="flex items-center space-x-2.5 bg-black/60 px-3 py-1.5 rounded-2xl border border-white/5 group hover:border-yellow-400/30 transition-all duration-500">
                        <span className="text-black font-black text-[9px] tracking-tight bg-yellow-400 px-1.5 py-1 rounded-lg leading-none shadow-[0_0_15px_rgba(250,204,21,0.15)] uppercase">IMDb</span>
                        <span className="text-white text-base font-black tracking-tighter leading-none">{movie.imdb_rating.toFixed(1)}</span>
                     </div>
                   )}
                </div>
                
                <div className="flex items-center space-x-2">
                   <Calendar size={18} className="text-popcorn-red" />
                   <span className="uppercase tracking-widest text-xs">{new Date(movie.created_at).getFullYear()}</span>
                </div>
                <div className="ml-auto">
                   <BookmarkButton postId={movie.id} />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Top Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <AdUnit 
          className="hidden md:flex" 
          minHeight="90px"
          code={`
            <script type="text/javascript">
              atOptions = {
                'key' : '64530885a0cbc7ae0904c3e6dfc4c192',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://www.highperformanceformat.com/64530885a0cbc7ae0904c3e6dfc4c192/invoke.js"></script>
          `} 
        />
        <AdUnit 
          className="md:hidden flex" 
          minHeight="50px"
          code={`
            <script type="text/javascript">
              atOptions = {
                'key' : '2b58bfa05eeeaedde521d109142d97e3',
                'format' : 'iframe',
                'height' : 50,
                'width' : 320,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://www.highperformanceformat.com/2b58bfa05eeeaedde521d109142d97e3/invoke.js"></script>
          `} 
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">

          {/* Storyline */}
          <section className="space-y-6">
             <div className="flex items-center space-x-4">
                <h2 className="text-3xl font-black uppercase tracking-tight">Storyline</h2>
                <div className="h-1 flex-1 bg-gradient-to-r from-popcorn-red/50 to-transparent rounded-full" />
             </div>
             {movie.content ? (
               <div className="break-words overflow-hidden">
                <div 
                  className="text-gray-400 leading-relaxed text-lg font-medium prose prose-invert prose-red max-w-none prose-headings:text-white prose-headings:font-black prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-400 prose-strong:text-white prose-em:text-gray-300 prose-a:text-popcorn-red prose-blockquote:border-popcorn-red prose-blockquote:text-gray-500"
                  dangerouslySetInnerHTML={{ __html: movie.content }}
                />
               </div>
             ) : (
               <p className="text-gray-400 leading-relaxed text-xl font-medium">
                 {movie.meta_description}
               </p>
             )}
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
          {/* Post Trailer Ad */}
          <div className="my-8">
            <AdUnit 
              className="hidden md:flex" 
              minHeight="90px"
              code={`
                <script type="text/javascript">
                  atOptions = {
                    'key' : '64530885a0cbc7ae0904c3e6dfc4c192',
                    'format' : 'iframe',
                    'height' : 90,
                    'width' : 728,
                    'params' : {}
                  };
                </script>
                <script type="text/javascript" src="https://www.highperformanceformat.com/64530885a0cbc7ae0904c3e6dfc4c192/invoke.js"></script>
              `} 
            />
            <AdUnit 
              className="md:hidden flex" 
              minHeight="50px"
              code={`
                <script type="text/javascript">
                  atOptions = {
                    'key' : '2b58bfa05eeeaedde521d109142d97e3',
                    'format' : 'iframe',
                    'height' : 50,
                    'width' : 320,
                    'params' : {}
                  };
                </script>
                <script type="text/javascript" src="https://www.highperformanceformat.com/2b58bfa05eeeaedde521d109142d97e3/invoke.js"></script>
              `} 
            />
          </div>
          <CommentSection postId={movie.id} />
        </div>

         {/* Sidebar */}
         <div className="space-y-8">
           {movie.download_links && movie.download_links.length > 0 && (
             <section className="bg-popcorn-card rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/2 flex items-center justify-between">
                   <h3 className="text-xl font-bold flex items-center space-x-3">
                     <Download size={22} className="text-popcorn-red" />
                     <span className="uppercase tracking-tighter">Download Options</span>
                   </h3>
                </div>
                
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full text-left border-collapse min-w-[320px]">
                    <thead>
                      <tr className="bg-black/40 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 border-b border-white/5">
                        <th className="pl-6 py-4">Quality</th>
                        <th className="px-4 py-4">Size</th>
                        <th className="pr-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {movie.download_links.map((link: any, i: number) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="pl-6 py-5">
                            <span className="text-xs font-black text-white group-hover:text-popcorn-red transition-colors capitalize">{link.quality}</span>
                          </td>
                          <td className="px-4 py-5">
                            <span className="text-[10px] font-bold text-popcorn-secondary">{link.size || '--'}</span>
                          </td>
                          <td className="pr-6 py-5 text-right">
                            <Link 
                              href={`/download/${movie.slug}/${link.slug || `${movie.slug}-${link.quality}`}`}
                              className="inline-flex items-center space-x-2 bg-popcorn-red text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-popcorn-red transition-all shadow-lg shadow-popcorn-red/20 active:scale-95 whitespace-nowrap"
                            >
                               <span>Download</span>
                               <span className="text-[8px]">▶</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-6 bg-black/20">
                   <AdUnit 
                    minHeight="250px"
                    className="w-[300px] h-[250px] mx-auto bg-white/5 rounded-xl"
                    code={`<script type="text/javascript" src="https://pl29300532.profitablecpmratenetwork.com/cb/84/86/cb84861c3dec1995f49a5b34cd3e2a06.js"></script>`}
                   />
                </div>
             </section>
           )}

           <section className="bg-popcorn-card p-6 rounded-xl border border-white/5 space-y-4 text-sm">
              <h3 className="font-bold text-white uppercase tracking-wider text-xs">Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-popcorn-secondary">Language</span>
                  <span className="text-white capitalize">{movie.language_tag}</span>
                </div>
                {movie.genre && (
                  <div className="flex justify-between">
                    <span className="text-popcorn-secondary">Genre</span>
                    <span className="text-white capitalize">{movie.genre}</span>
                  </div>
                )}
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