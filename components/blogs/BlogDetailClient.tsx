'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Eye, ArrowLeft, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import CommentSection from '@/components/interactions/CommentSection'
import AdUnit from '@/components/ui/AdUnit'

interface BlogDetailClientProps {
  post: any
  relatedPosts: any[]
}

export default function BlogDetailClient({ post, relatedPosts }: BlogDetailClientProps) {
  const readingTime = Math.ceil((post.word_count || 1) / 200)

  return (
    <article className="bg-[#0a0a0a] min-h-screen text-white pb-24">
      {/* ZONE 1: NAVIGATION BACK */}
      <div className="max-w-[860px] mx-auto px-6 pt-12 pb-4">
        <Link 
          href="/blogs"
          className="flex items-center space-x-2 text-[#666] hover:text-popcorn-red transition-colors w-fit group"
        >
           <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
           <span className="text-[13px] font-medium">Back to Blogs</span>
        </Link>
      </div>

      {/* ZONE 2: ARTICLE HEADER (TWO COLUMN) */}
      <header className="max-w-[900px] mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* LEFT: Cover Image */}
          <div className="relative w-full md:w-[300px] h-[200px] shrink-0 rounded-[10px] overflow-hidden border border-white/5 bg-neutral-900">
             {post.cover_image ? (
               <Image
                 src={post.cover_image}
                 alt={post.title}
                 fill
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
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
          <div className="flex-1 space-y-4">
             <div className="flex flex-wrap gap-2">
                <span className="bg-[#E50914] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">BLOGS</span>
                <span className="bg-transparent text-[#aaa] border border-[#444] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{post.language_tag}</span>
             </div>

             <h1 className="text-2xl md:text-[26px] font-[700] text-white leading-[1.3] uppercase-none">
               {post.title}
             </h1>

             <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#666]">
                <div className="flex items-center gap-1.5">
                   <span>📅</span>
                   <span>{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                   <span>⏱</span>
                   <span>{readingTime} min read</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                   <span>👁</span>
                   <span>1.2K views</span>
                </div>
             </div>

             {post.genre && (
               <div className="flex">
                  <span className="bg-transparent text-[#aaa] border border-[#444] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {post.genre}
                  </span>
               </div>
             )}

             {post.meta_description && (
               <p className="text-sm text-[#666] leading-relaxed italic line-clamp-3">
                 &quot;{post.meta_description}&quot;
               </p>
             )}

             <button 
               onClick={() => {
                 const content = document.querySelector('.prose-blog')
                 content?.scrollIntoView({ behavior: 'smooth' })
               }}
               className="text-[11px] font-bold text-popcorn-red uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1.5 pt-2"
             >
                READ MORE <span className="text-lg">→</span>
             </button>
          </div>
        </div>
      </header>

      {/* ZONE 3: ARTICLE BODY */}
      <section className="max-w-[900px] mx-auto px-6">
        <div className="prose-blog">
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p>{post.meta_description}</p>
          )}
        </div>

        {/* ZONE 4: AD PLACEMENT */}
        <div className="max-w-[900px] mx-auto my-12 overflow-hidden rounded-lg adsterra-native-container ad-container">
           <AdUnit 
             minHeight={150}
             code={`
               <script async="async" data-cfasync="false" src="https://pl29300533.profitablecpmratenetwork.com/da55b4511adc1415509e85c18ae83962/invoke.js"></script>
               <div id="container-da55b4511adc1415509e85c18ae83962"></div>
             `}
           />
        </div>

        {/* ZONE 6: RELATED POSTS */}
        {relatedPosts.length > 0 && (
          <div className="pt-12 border-t border-white/5">
             <h4 className="text-[12px] text-[#666] font-bold tracking-[3px] uppercase mb-8">YOU MIGHT ALSO LIKE</h4>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((p) => (
                  <Link key={p.id} href={`/blogs/${p.slug}`} className="group space-y-3">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900">
                       <Image
                         src={p.cover_image || ''}
                         alt={p.title}
                         fill
                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                         className="object-cover transition-all duration-300 group-hover:brightness-110"
                       />
                    </div>
                    <div>
                      <h5 className="text-white text-[13px] font-bold leading-tight line-clamp-2 group-hover:text-popcorn-red transition-colors">
                        {p.title}
                      </h5>
                      <p className="text-[11px] text-[#666] mt-1">
                        {format(new Date(p.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </Link>
                ))}
             </div>
          </div>
        )}

        {/* ZONE 5: COMMENTS SECTION */}
        <div className="pt-16 mt-16 border-t border-white/5">
           <div className="flex items-center gap-2 mb-8">
              <MessageSquare size={18} className="text-[#E50914]" />
              <h3 className="text-[13px] text-white font-bold tracking-[2px] uppercase">COMMENTS</h3>
           </div>
           <CommentSection postId={post.id} />
        </div>
      </section>

      {/* Global Typography Styles */}
      <style jsx global>{`
        .prose-blog p {
          color: #d4d4d4;
          font-size: 16px;
          line-height: 1.85;
          margin-bottom: 20px;
          font-style: normal;
          font-weight: 400;
        }
        .prose-blog h2 {
          color: #fff;
          font-size: 22px;
          font-weight: 700;
          font-style: normal;
          margin: 32px 0 14px;
          padding-left: 14px;
          border-left: 3px solid #E50914;
          line-height: 1.2;
        }
        .prose-blog h3 {
          color: #fff;
          font-size: 18px;
          font-weight: 600;
          font-style: normal;
          margin: 24px 0 10px;
          line-height: 1.2;
        }
        .prose-blog ul, .prose-blog ol {
          margin-bottom: 20px;
          padding-left: 20px;
        }
        .prose-blog li {
          color: #d4d4d4;
          font-size: 16px;
          line-height: 1.7;
          margin-bottom: 8px;
        }
        .prose-blog blockquote {
          border-left: 3px solid #E50914;
          padding: 12px 20px;
          margin: 32px 0;
          background: #141414;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #aaa;
        }
        .prose-blog blockquote p {
          margin-bottom: 0;
          font-size: 15px;
          color: #aaa;
        }
        .prose-blog a {
          color: #E50914;
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .prose-blog strong {
          color: #fff;
          font-weight: 700;
        }
        
        /* ADSTERRA FIX */
        .adsterra-native-container {
          max-width: 100% !important;
          overflow: hidden !important;
        }
        .adsterra-native-container > div {
          max-width: 100% !important;
          width: 100% !important;
        }
        .adsterra-native-container iframe {
          max-width: 100% !important;
        }
      `}</style>
    </article>
  )
}
