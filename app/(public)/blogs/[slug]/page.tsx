import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Calendar, User, Clock, ChevronLeft, ArrowLeft } from 'lucide-react'
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
      
      {/* Header Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          {post.cover_image && (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover opacity-30 blur-md scale-110"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-popcorn-dark via-popcorn-dark/80 to-transparent" />
        </div>

        <div className="relative h-full max-w-4xl mx-auto px-4 flex flex-col justify-end pb-12 space-y-6">
            <Link 
              href="/blogs"
              className="flex items-center space-x-2 text-popcorn-secondary hover:text-white transition-colors w-fit mb-4"
            >
               <ArrowLeft size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Back to Blogs</span>
            </Link>

            <div className="space-y-4">
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-popcorn-red">
                   <span>Published</span>
                   <span className="w-1 h-1 rounded-full bg-white/20" />
                   <span className="text-white">{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
                   <span className="w-1 h-1 rounded-full bg-white/20" />
                   <span className="text-white">{readingTime} min read</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight italic uppercase">
                  {post.title}
                </h1>

                <p className="text-xl text-popcorn-secondary font-medium italic leading-relaxed max-w-3xl">
                  &quot;{post.meta_description}&quot;
                </p>
            </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Top Banner Ad */}
        <div className="mb-12">
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

        {/* Content Section */}
        <div className="prose prose-invert prose-red max-w-none prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-xl prose-headings:text-white prose-headings:font-black prose-strong:text-white prose-img:rounded-3xl">
          <div className="space-y-8 break-words overflow-hidden">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: injectInArticleAds(post.content) }} />
            ) : (
              <p>No content available.</p>
            )}
          </div>
        </div>

        {/* Extra Native Ad */}
        <div className="my-16">
          <AdUnit 
            minHeight="150px"
            code={`
              <script async="async" data-cfasync="false" src="https://pl29300533.profitablecpmratenetwork.com/da55b4511adc1415509e85c18ae83962/invoke.js"></script>
              <div id="container-da55b4511adc1415509e85c18ae83962"></div>
            `}
          />
        </div>

        {/* Comments Section */}
        <div className="pt-16 border-t border-white/5">
          <CommentSection postId={post.id} />
        </div>
      </div>
    </article>
  )
}

function injectInArticleAds(content: string) {
  const adCode = `
    <div class="my-12 flex justify-center">
      <script async="async" data-cfasync="false" src="https://pl29300533.profitablecpmratenetwork.com/da55b4511adc1415509e85c18ae83962/invoke.js"></script>
      <div id="container-da55b4511adc1415509e85c18ae83962"></div>
    </div>
  `;
  
  const paragraphs = content.split('</p>');
  if (paragraphs.length <= 3) return content;

  let newContent = '';
  for (let i = 0; i < paragraphs.length; i++) {
    newContent += paragraphs[i] + (i < paragraphs.length - 1 ? '</p>' : '');
    if ((i + 1) % 4 === 0 && i < paragraphs.length - 1) {
      newContent += adCode;
    }
  }
  return newContent;
}
