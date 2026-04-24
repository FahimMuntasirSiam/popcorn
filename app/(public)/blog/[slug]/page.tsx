import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Calendar, User, Clock, ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { format } from 'date-fns'
import CommentSection from '@/components/interactions/CommentSection'
import AdUnit from '@/components/ui/AdUnit'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient()
  const { data: post } = await supabase.from('posts').select('*').eq('slug', params.slug).single()

  if (!post) return { title: 'Not Found | Popcorn' }

  const title = `${post.title} | Popcorn`
  const description = post.meta_description || post.content?.substring(0, 160) || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: post.cover_image ? [{ url: post.cover_image }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.cover_image ? [post.cover_image] : [],
    },
  }
}

export default async function BlogPostPage({ 
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

  const readingTime = Math.ceil((post.word_count || 1) / 200)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description,
    image: post.cover_image,
    datePublished: post.created_at,
    author: {
      '@type': 'Person',
      name: 'Popcorn Editor',
    },
  }

  return (
    <article className="bg-popcorn-dark min-h-screen text-white pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Premium Backdrop Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          {post.cover_image && (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover opacity-20 blur-sm scale-110"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-popcorn-dark via-popcorn-dark/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-popcorn-dark/80 via-transparent to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-end pb-12 gap-8 md:gap-12">
          {/* Poster on Left */}
          <div className="relative w-44 md:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 shrink-0 transform md:-rotate-2 hover:rotate-0 transition-transform duration-500">
            {post.cover_image && (
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
              />
            )}
          </div>
          
          {/* Info on Right */}
          <div className="flex-1 space-y-6 md:pb-4">
             <div className="space-y-4">
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-popcorn-red">
                   <span>Post</span>
                   <span className="w-1 h-1 rounded-full bg-white/20" />
                   <span className="text-white">{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none italic uppercase">
                  {post.title}
                  <span className="ml-2 inline-flex items-center justify-center w-8 h-8 md:w-12 md:h-12 border-2 border-white/40 rounded-full text-lg md:text-2xl not-italic translate-y-[-4px] md:translate-y-[-8px] font-light">&gt;</span>
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-popcorn-secondary">
                   <div className="flex items-center space-x-2">
                      <Star size={14} className="fill-popcorn-gold text-popcorn-gold" />
                      <span className="text-white">7.0 (51)</span>
                   </div>
                   <span className="w-1 h-1 rounded-full bg-white/20" />
                   <div className="flex items-center space-x-2">
                      <TrendingUp size={14} />
                      <span>#{Math.floor(Math.random() * 200)} Editor Choice</span>
                   </div>
                   <span className="w-1 h-1 rounded-full bg-white/20" />
                   <span>Blog Series</span>
                   <span className="w-1 h-1 rounded-full bg-white/20" />
                   <span>{readingTime} min read</span>
                </div>
             </div>

             <div className="flex flex-wrap gap-3 pt-2">
                <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-md">
                   <Plus size={14} />
                   <span>Save Post</span>
                </button>
                <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-md">
                   <Star size={14} />
                   <span>Rate</span>
                </button>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-16 pt-12">
        <div className="lg:col-span-2 space-y-12">
           {/* Lead Text / Meta Description */}
           <div className="space-y-6">
              <p className="text-[10px] font-black text-popcorn-red uppercase tracking-[0.3em]">Featured Story</p>
              <h2 className="text-xl md:text-2xl font-bold italic leading-relaxed text-neutral-100 border-l-4 border-popcorn-red pl-6">
                &quot;{post.meta_description}&quot;
              </h2>
           </div>

           {/* Content Section */}
           <div className="prose prose-invert prose-red max-w-none prose-p:text-gray-400 prose-p:leading-relaxed prose-p:text-lg prose-headings:text-white prose-headings:font-black prose-strong:text-white">
             <div className="space-y-8 break-words overflow-hidden">
                {post.content ? (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                ) : (
                  <p>No content available.</p>
                )}
             </div>
           </div>

           {/* Ad Unit */}
           <AdUnit type="native" position="blog_in_article" />

           {/* Comments Section */}
           <div className="pt-16 border-t border-white/5">
              <CommentSection postId={post.id} />
           </div>
        </div>

        {/* Sidebar Space (for ads/tags) */}
        <div className="space-y-12">
           <div className="space-y-4">
              <p className="text-[10px] font-black text-popcorn-secondary uppercase tracking-[0.2em]">Categories</p>
              <div className="flex flex-wrap gap-2">
                 <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white">
                    {post.language_tag}
                 </span>
                 <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white">
                    {post.category}
                 </span>
              </div>
           </div>

           <AdUnit type="sidebar" position="blog_sidebar" />
           
           <div className="bg-white/5 rounded-3xl p-8 border border-white/10 space-y-6">
              <div className="space-y-2 text-center">
                 <h4 className="text-sm font-black uppercase tracking-widest text-white">Share this story</h4>
                 <p className="text-[10px] text-popcorn-secondary font-medium">Help us grow our community</p>
              </div>
              <div className="flex justify-center space-x-4">
                 {['fb', 'tw', 'ig'].map(s => (
                   <div key={s} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-popcorn-red transition-all cursor-pointer border border-white/10">
                      <span className="text-[10px] font-black uppercase">{s}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </article>
  )
}

function Star(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  )
}

function TrendingUp(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
  )
}

function Plus(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  )
}