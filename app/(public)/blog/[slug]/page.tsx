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

  // Calculate reading time (roughly 200 words per minute)
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
    <article className="bg-popcorn-dark min-h-screen text-white pt-12 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <Link 
          href="/category/blog" 
          className="flex items-center text-popcorn-secondary hover:text-white transition-colors mb-8 text-sm font-medium"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Blog
        </Link>

        {/* Header content */}
        <header className="space-y-6 mb-12">
          <div className="flex items-center space-x-2">
            <span className="bg-popcorn-red text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
              {post.category.replace('-', ' ')}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-popcorn-secondary border-y border-white/10 py-4 font-medium">
             <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-popcorn-red" />
                <span>{format(new Date(post.created_at), 'MMMM dd, yyyy')}</span>
             </div>
             <div className="flex items-center space-x-2">
                <Clock size={16} className="text-popcorn-red" />
                <span>{readingTime} min read</span>
             </div>
             <div className="flex items-center space-x-2">
                <User size={16} className="text-popcorn-red" />
                <span>Editor</span>
             </div>
          </div>
        </header>

        {/* Cover Image */}
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/10">
          {post.cover_image && (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        {/* Content Section */}
        <div className="prose prose-invert prose-red max-w-none">
          {/* Renders TipTap content with in-article ad */}
          <div className="text-gray-300 leading-relaxed text-lg space-y-6">
             {post.content ? (
               (() => {
                 const paragraphs = post.content.split('</p>');
                 if (paragraphs.length <= 3) {
                   return <div dangerouslySetInnerHTML={{ __html: post.content }} />;
                 }
                 const firstPart = paragraphs.slice(0, 3).join('</p>') + '</p>';
                 const secondPart = paragraphs.slice(3).join('</p>');
                 return (
                   <>
                     <div dangerouslySetInnerHTML={{ __html: firstPart }} />
                     <AdUnit type="native" position="blog_in_article" />
                     <div dangerouslySetInnerHTML={{ __html: secondPart }} />
                   </>
                 );
               })()
             ) : (
               <p>No content available.</p>
             )}
          </div>
        </div>

        {/* Floating red accents / dividers */}
        <div className="mt-16 h-1 w-24 bg-popcorn-red rounded-full" />

        {/* Comments Section */}
        <div className="mt-20">
          <CommentSection postId={post.id} />
        </div>

        {/* Bottom Metadata */}
        <footer className="mt-20 pt-12 border-t border-white/10 flex flex-col items-center text-center space-y-6">
           <div className="space-y-2">
             <h3 className="text-xl font-bold uppercase tracking-wider">Share this story</h3>
             <p className="text-popcorn-secondary text-sm">Spread the word about your favorite movies</p>
           </div>
           
           <div className="flex space-x-4">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-popcorn-red transition-all cursor-pointer">
                <span className="font-bold">F</span>
              </div>
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-popcorn-red transition-all cursor-pointer">
                <span className="font-bold">X</span>
              </div>
           </div>
        </footer>
      </div>
    </article>
  )
}