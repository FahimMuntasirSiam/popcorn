import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Calendar, Clock, ArrowLeft, Eye, Tag } from 'lucide-react'
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://popcorn.example.com'
  const fullUrl = `${baseUrl}/${post.category}/${post.slug}`
  const title = `${post.title} | Popcorn`
  const description = post.meta_description || post.content?.substring(0, 160) || ''

  return {
    title,
    description,
    keywords: `${post.title}, ${post.genre}, ${post.language_tag}, film blog, news`,
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
      type: 'article',
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
  const excerpt = post.content?.replace(/<[^>]*>/g, '').substring(0, 150) + '...'

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://popcorn.example.com'
  const fullUrl = `${baseUrl}/${post.category}/${post.slug}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.meta_description,
    "image": post.cover_image,
    "datePublished": post.created_at,
    "dateModified": post.updated_at,
    "author": {
      "@type": "Organization",
      "name": "Popcorn"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Popcorn",
      "url": baseUrl
    },
    "mainEntityOfPage": fullUrl,
  }

  return (
    <article className="bg-[#0a0a0a] min-h-screen text-white pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Header / Hero Section */}
      <div className="max-w-[900px] mx-auto px-4 pt-32 pb-12">
        <Link 
          href="/blogs"
          className="flex items-center space-x-2 text-neutral-500 hover:text-popcorn-red transition-colors w-fit mb-10 group"
        >
           <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
           <span className="text-[10px] font-black uppercase tracking-widest">Back to Blogs</span>
        </Link>

        <div className="flex flex-col md:flex-row gap-10">
          {/* LEFT: Cover Image */}
          <div className="relative w-full md:w-[320px] h-[180px] rounded-[10px] overflow-hidden border border-white/5 bg-neutral-900 shrink-0">
            {post.cover_image ? (
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                 <span className="text-neutral-700 italic">No Image</span>
              </div>
            )}
          </div>

          {/* RIGHT: Meta Info */}
          <div className="flex-1 space-y-6">
             <div className="flex items-center gap-3">
                <span className="bg-popcorn-red text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">BLOGS</span>
                <span className="bg-white/5 text-neutral-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">{post.language_tag}</span>
             </div>

             <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight italic !font-serif uppercase">
                  {post.title}
                </h1>
                <p className="text-lg text-neutral-500 font-medium italic leading-relaxed">
                  &quot;{post.meta_description}&quot;
                </p>
             </div>

             <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
                <div className="flex items-center space-x-2">
                   <Calendar size={14} className="text-popcorn-red" />
                   <span>{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center space-x-2">
                   <Clock size={14} className="text-popcorn-red" />
                   <span>{readingTime} min read</span>
                </div>
                <div className="flex items-center space-x-2">
                   <Eye size={14} className="text-popcorn-red" />
                   <span>1.2k Views</span>
                </div>
             </div>

             <div className="flex flex-wrap gap-2 pt-2">
                {(post.genre?.split(',') || []).map((g: string) => (
                  <span key={g} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-neutral-400">
                    {g.trim()}
                  </span>
                ))}
             </div>

             <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl border-l-2 border-white/10 pl-4 italic">
                {excerpt}
             </p>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4">
        <div className="h-px bg-white/5 w-full mb-12" />
      </div>

      <div className="max-w-[760px] mx-auto px-4">
        {/* Ad Unit */}
        <div className="mb-16">
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
        </div>

        {/* Article Content Section */}
        <div className="prose prose-invert prose-red max-w-none 
          prose-p:text-[#d1d1d1] prose-p:leading-[1.8] prose-p:text-lg 
          prose-headings:text-white prose-headings:font-black
          prose-h2:text-[22px] prose-h2:border-l-4 prose-h2:border-popcorn-red prose-h2:pl-6 prose-h2:font-black
          prose-h3:text-[18px] prose-h3:font-bold
          prose-strong:text-white prose-img:rounded-3xl prose-a:text-popcorn-red
          prose-blockquote:border-l-4 prose-blockquote:border-popcorn-red prose-blockquote:bg-white/2 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-neutral-400
          prose-ul:list-disc prose-li:marker:text-popcorn-red
        ">
          <div className="space-y-10 break-words overflow-hidden">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: injectInArticleAds(post.content) }} />
            ) : (
              <p>No content available.</p>
            )}
          </div>
        </div>

        {/* Final Ad Unit */}
        <div className="my-20">
          <AdUnit 
            minHeight="150px"
            code={`
              <script async="async" data-cfasync="false" src="https://pl29300533.profitablecpmratenetwork.com/da55b4511adc1415509e85c18ae83962/invoke.js"></script>
              <div id="container-da55b4511adc1415509e85c18ae83962"></div>
            `}
          />
        </div>

        {/* Comments Section */}
        <div className="pt-20 border-t border-white/5">
          <CommentSection postId={post.id} />
        </div>
      </div>
    </article>
  )
}

function injectInArticleAds(content: string) {
  const adCode = `
    <div class="my-16 flex justify-center">
      <iframe
        style="width:100%; height:150px; border:none;"
        srcdoc='
          <html>
            <body style="margin:0; padding:0; display:flex; justify-content:center; align-items:center; background:transparent;">
              <script async="async" data-cfasync="false" src="https://pl29300533.profitablecpmratenetwork.com/da55b4511adc1415509e85c18ae83962/invoke.js"></script>
              <div id="container-da55b4511adc1415509e85c18ae83962"></div>
            </body>
          </html>
        '
      ></iframe>
    </div>
  `;
  
  const paragraphs = content.split('</p>');
  if (paragraphs.length <= 3) return content;

  let newContent = '';
  for (let i = 0; i < paragraphs.length; i++) {
    newContent += paragraphs[i] + (i < paragraphs.length - 1 ? '</p>' : '');
    if ((i + 1) === 3) { // After 3rd paragraph
      newContent += adCode;
    }
  }
  return newContent;
}
