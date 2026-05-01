import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import CommentSection from '@/components/interactions/CommentSection'
import AdUnit from '@/components/ui/AdUnit'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Share2, MessageSquare } from 'lucide-react'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient()
  const { data: post } = await supabase.from('posts').select('*').eq('slug', params.slug).single()

  if (!post) return { title: 'Not Found | Popcorn' }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://popcorn.example.com'
  const fullUrl = `${baseUrl}/${post.category}/${post.slug}`
  const title = `${post.title} Trailer | Popcorn`
  const description = post.meta_description || `Watch the official trailer for ${post.title}`

  return {
    title,
    description,
    keywords: `${post.title}, ${post.genre}, trailer, movie trailer`,
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
      type: 'video.other',
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

export default async function TrailerPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const supabase = createClient()
  
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!post) {
    notFound()
  }

  const getYoutubeId = (url: string | null) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const videoId = getYoutubeId(post.trailer_url)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://popcorn.example.com'
  const fullUrl = `${baseUrl}/${post.category}/${post.slug}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": post.title,
    "description": post.meta_description,
    "thumbnailUrl": post.cover_image,
    "uploadDate": post.created_at,
    "embedUrl": post.trailer_url,
    "contentUrl": fullUrl,
  }

  return (
    <article className="bg-popcorn-dark min-h-screen text-white pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Trailer Section */}
      <div className="relative w-full aspect-video bg-black pt-16">
        <div className="absolute inset-0">
          {videoId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={`${post.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-popcorn-secondary">
              Trailer not available
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-12 space-y-12">
        {/* Ad Unit */}
        <AdUnit 
          className="mx-auto" 
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

        <div className="flex flex-col md:flex-row gap-12">
          {/* Content Left */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-popcorn-red">
                <span>Trailer</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{post.language_tag}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{post.genre}</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-none">
                {post.title}
              </h1>

              <div className="flex items-center space-x-6 pt-4">
                 <button className="flex items-center space-x-2 text-popcorn-secondary hover:text-white transition-colors">
                    <Share2 size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Share</span>
                 </button>
                 <button className="flex items-center space-x-2 text-popcorn-secondary hover:text-white transition-colors">
                    <MessageSquare size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Discussion</span>
                 </button>
              </div>
            </div>

            <div className="prose prose-invert prose-red max-w-none">
              <p className="text-gray-400 text-lg leading-relaxed">
                {post.meta_description}
              </p>
              <div 
                className="mt-8 text-gray-300"
                dangerouslySetInnerHTML={{ __html: post.content || '' }} 
              />
            </div>
          </div>

          {/* Sidebar Right */}
          <div className="w-full md:w-80 shrink-0">
             <div className="bg-popcorn-card border border-white/5 rounded-3xl p-8 space-y-8 sticky top-24">
                <div className="space-y-4">
                   <h4 className="text-xs font-black uppercase tracking-widest text-popcorn-secondary">About this Trailer</h4>
                   <p className="text-sm text-gray-400 leading-relaxed font-medium">
                     Check out the official trailer for <b>{post.title}</b>. Don&apos;t forget to share your thoughts in the comments below!
                   </p>
                </div>
                
                <Link 
                  href="/trailers"
                  className="flex items-center justify-center space-x-3 w-full bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl transition-all"
                >
                   <ArrowLeft size={16} />
                   <span className="text-xs font-black uppercase tracking-widest">More Trailers</span>
                </Link>

                <AdUnit 
                  minHeight="250px"
                  className="w-[300px] h-[250px] mx-auto bg-white/5 rounded-xl"
                  code={`<script type="text/javascript" src="https://pl29300532.profitablecpmratenetwork.com/cb/84/86/cb84861c3dec1995f49a5b34cd3e2a06.js"></script>`}
                />
             </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="pt-16 border-t border-white/5">
          <CommentSection postId={post.id} />
        </div>
      </div>
    </article>
  )
}
