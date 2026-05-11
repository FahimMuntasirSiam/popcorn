'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import BookmarkButton from '@/components/interactions/BookmarkButton'
import CommentSection from '@/components/interactions/CommentSection'
import AdUnit from '@/components/ui/AdUnit'

interface MovieDetailClientProps {
  movie: any
  videoId: string | null
}

export default function MovieDetailClient({ movie, videoId }: MovieDetailClientProps) {
  return (
    <div className="bg-popcorn-dark min-h-screen text-white pb-20">
      {/* SECTION 1: HERO */}
      <div className="relative w-full min-h-[380px] overflow-hidden py-12 md:py-20">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0">
          {movie.cover_image && (
            <Image
              src={movie.cover_image}
              alt={movie.title}
              fill
              sizes="100vw"
              className="object-cover blur-[40px] opacity-40 scale-110"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-[#0a0a0a]" />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-[1100px] mx-auto px-6 flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
          {/* LEFT: Poster */}
          <div className="relative w-[200px] h-[300px] shrink-0 rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-2 border-white/10 group">
             {movie.cover_image && (
               <Image 
                src={movie.cover_image} 
                alt={movie.title} 
                fill 
                sizes="200px"
                className="object-cover"
               />
             )}
          </div>

          {/* RIGHT: Info */}
          <div className="flex-1 text-center md:text-left space-y-4">
             {/* Row 1: Badges */}
             <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="bg-popcorn-red text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {movie.category}
                </span>
                <span className="bg-white/10 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                  {movie.language_tag}
                </span>
                {movie.genre && (
                  <span className="bg-white/10 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                    {movie.genre}
                  </span>
                )}
             </div>

             {/* Row 2: Title */}
             <h1 className="text-3xl md:text-[36px] font-[800] text-white leading-tight uppercase tracking-tight">
               {movie.title}
             </h1>

             {/* Row 3: Ratings */}
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                {movie.imdb_rating && (
                   <div className="flex items-center gap-2">
                      <div className="bg-[#F5C518] text-black text-[13px] font-[700] px-2 py-0.5 rounded flex items-center gap-1.5">
                         <span>IMDb</span>
                         <span>★ {movie.imdb_rating.toFixed(1)}/10</span>
                      </div>
                   </div>
                )}
                
                {(movie.avg_rating || movie.total_reviews > 0) && (
                   <div className="flex items-center gap-2">
                      <div className="flex text-[#F5C518]">
                         {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className={cn("fill-current", i < Math.round((movie.avg_rating || 0) / 2) ? "opacity-100" : "opacity-20")} 
                            />
                         ))}
                      </div>
                      <span className="text-neutral-400 text-sm font-medium">
                        {((movie.avg_rating || 0) / 2).toFixed(1)} ({movie.total_reviews || 0} votes)
                      </span>
                   </div>
                )}
             </div>

             {/* Row 4: Meta info */}
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                <div className="flex items-center gap-2 text-[#aaa] text-[13px] font-medium">
                   <span>📅</span>
                   <span>{new Date(movie.created_at).getFullYear()}</span>
                </div>
                <span className="text-white/10">•</span>
                <div className="flex items-center gap-2 text-[#aaa] text-[13px] font-medium">
                   <span>🌐</span>
                   <span className="capitalize">{movie.language_tag}</span>
                </div>
                {movie.genre && (
                  <>
                    <span className="text-white/10">•</span>
                    <div className="flex items-center gap-2 text-[#aaa] text-[13px] font-medium">
                       <span>🎬</span>
                       <span className="capitalize">{movie.genre}</span>
                    </div>
                  </>
                )}
                <BookmarkButton postId={movie.id} />
             </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: MAIN CONTENT */}
      <div className="max-w-[1100px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT COLUMN: 65% */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Storyline Section */}
            <section>
               <h2 className="text-[13px] text-[#E50914] font-[700] tracking-[3px] uppercase mb-6">STORYLINE</h2>
               <div className="prose-custom">
                 {movie.content ? (
                   <div 
                    className="text-[#d1d1d1] leading-[1.8] text-[15px]"
                    dangerouslySetInnerHTML={{ __html: movie.content }}
                   />
                 ) : (
                   <p className="text-[#d1d1d1] leading-[1.8] text-[15px]">
                     {movie.meta_description}
                   </p>
                 )}
               </div>
            </section>

            {/* AD PLACEMENT 1 */}
            <div id="ad-movie-content" className="min-h-[120px] flex items-center justify-center overflow-hidden ad-container">
               <AdUnit 
                className="hidden md:flex" 
                minHeight={90}
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
                minHeight={50}
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

            {/* Trailer Section */}
            {videoId && (
              <section className="space-y-6 pt-4">
                 <h2 className="text-[13px] text-[#E50914] font-[700] tracking-[3px] uppercase mb-6">OFFICIAL TRAILER</h2>
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
            <section className="pt-8">
               <h2 className="text-[13px] text-[#E50914] font-[700] tracking-[3px] uppercase mb-8">COMMENTS</h2>
               <CommentSection postId={movie.id} />
            </section>
          </div>

          {/* RIGHT COLUMN: 320px Sidebar */}
          <div className="space-y-8">
            {/* DOWNLOAD OPTIONS */}
            {movie.download_links && movie.download_links.length > 0 && (
              <section id="download-options" className="bg-[#141414] rounded-xl border border-[#222] overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-[#1f1f1f]">
                   <h3 className="text-[12px] text-[#E50914] font-[700] tracking-[2px] uppercase">
                     ⬇ DOWNLOAD OPTIONS
                   </h3>
                </div>
                
                <div className="divide-y divide-[#1f1f1f]">
                  {movie.download_links.map((link: any, i: number) => (
                    <div key={i} className="p-4 flex items-center justify-between group hover:bg-[#1a1a1a] transition-colors">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-popcorn-red transition-colors capitalize">{link.quality}</span>
                        <span className="text-[12px] font-medium text-[#666]">{link.size || '--'}</span>
                      </div>
                      <Link 
                        href={`/download/${movie.slug}/${link.slug || `${movie.slug}-${link.quality}`}`}
                        className="bg-[#E50914] text-white px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-popcorn-red transition-all shadow-lg active:scale-95 flex items-center gap-1.5"
                      >
                         <span>DOWNLOAD</span>
                         <span className="text-[8px]">▶</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* AD BOX */}
            <section className="bg-[#141414] rounded-xl border border-[#222] p-4 flex flex-col items-center ad-container">
               <p className="text-[9px] text-[#444] font-bold uppercase tracking-wider mb-3">ADVERTISEMENT</p>
               <div id="ad-movie-sidebar" className="min-h-[250px] w-full flex items-center justify-center bg-white/[0.02] rounded-lg">
                  <AdUnit 
                    minHeight={250}
                    className="w-[300px] h-[250px]"
                    code={`<script type="text/javascript" src="https://pl29300532.profitablecpmratenetwork.com/cb/84/86/cb84861c3dec1995f49a5b34cd3e2a06.js"></script>`}
                   />
               </div>
            </section>

            {/* DETAILS Card */}
            <section className="bg-[#141414] rounded-xl border border-[#222] p-5 space-y-4">
               <h3 className="text-[12px] text-white font-[700] tracking-[1px] uppercase pb-2 border-b border-[#1f1f1f]">DETAILS</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#666] font-medium">Language</span>
                    <span className="text-white font-bold capitalize">{movie.language_tag}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#666] font-medium">Genre</span>
                    <span className="text-white font-bold capitalize">{movie.genre || '--'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#666] font-medium">Category</span>
                    <span className="text-white font-bold capitalize">{movie.category}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#666] font-medium">Status</span>
                    <span className="bg-white/5 text-white/60 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-white/5">
                      {movie.status}
                    </span>
                  </div>
               </div>
            </section>
          </div>
        </div>
      </div>

      {/* SECTION 3: STICKY DOWNLOAD BAR (MOBILE) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#141414]/98 backdrop-blur-md border-t border-[#333] px-5 py-3.5 z-50 flex items-center justify-between animate-in slide-in-from-bottom duration-300">
         <div className="flex flex-col max-w-[60%]">
            <span className="text-white text-[13px] font-bold line-clamp-1 uppercase tracking-tight">{movie.title}</span>
            <span className="text-[#666] text-[10px] font-medium">Ready for download</span>
         </div>
         <button 
           onClick={() => {
             const downloadSection = document.getElementById('download-options')
             if (downloadSection) {
               downloadSection.scrollIntoView({ behavior: 'smooth' })
             }
           }}
           className="bg-[#E50914] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest shadow-xl active:scale-95"
         >
           ⬇ Download
         </button>
      </div>

      {/* Custom Styling for Storyline Content */}
      <style jsx global>{`
        .prose-custom p {
          color: #d1d1d1;
          line-height: 1.8;
          font-size: 15px;
          margin-bottom: 16px;
        }
        .prose-custom h2 {
          color: white;
          font-size: 20px;
          font-weight: 700;
          margin: 32px 0 16px;
          padding-left: 14px;
          border-left: 3px solid #E50914;
          line-height: 1.2;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .prose-custom h3 {
          color: white;
          font-size: 17px;
          font-weight: 600;
          margin: 24px 0 12px;
          line-height: 1.2;
        }
        .prose-custom ul {
          margin-bottom: 16px;
          padding-left: 0;
        }
        .prose-custom ul li {
          color: #d1d1d1;
          margin-bottom: 8px;
          list-style: none;
          padding-left: 20px;
          position: relative;
          font-size: 15px;
        }
        .prose-custom ul li::before {
          content: "▸";
          color: #E50914;
          position: absolute;
          left: 0;
          font-weight: bold;
        }
        .prose-custom strong {
          color: white;
          font-weight: 700;
        }
        .prose-custom em {
          color: #aaa;
          font-style: italic;
        }
        .prose-custom a {
          color: #E50914;
          text-decoration: underline;
          text-underline-offset: 4px;
          transition: opacity 0.2s;
        }
        .prose-custom a:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  )
}
