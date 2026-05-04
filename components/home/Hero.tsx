'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Download, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Post } from '@/types'
import { cn } from '@/lib/utils'

interface HeroProps {
  movies: Post[];
}

export default function Hero({ movies }: HeroProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (movies.length > 0) {
      setCurrent(Math.floor(movies.length / 2))
    }
  }, [movies.length])

  if (!movies.length || !movies[current]) return null
  const activeMovie = movies[current]

  const next = () => setCurrent((prev) => (prev + 1) % movies.length)
  const prev = () => setCurrent((prev) => (prev - 1 + movies.length) % movies.length)

  return (
    <div className="relative w-full min-h-[420px] lg:h-[580px] overflow-hidden bg-popcorn-dark flex flex-col items-center justify-center pt-20 pb-10">
      {/* Fixed Premium Backdrop */}
      <div className="absolute inset-0">
        <Image
          src="/premium_hero.png"
          alt="Premium Banner"
          fill
          className="object-cover object-center opacity-50"
          priority
        />
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 50%, rgba(10,10,10,1) 100%)'
          }} 
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center">
        
        {/* Cover Flow Carousel */}
        <div className="relative w-full h-[300px] lg:h-[350px] flex items-center justify-center mb-6">
           {movies.map((movie, idx) => {
             // Calculate position relative to current
             let offset = idx - current;
             if (offset > 2) offset -= movies.length;
             if (offset < -2) offset += movies.length;

             const isCenter = idx === current;
             const isNear = Math.abs(offset) === 1;
             const isFar = Math.abs(offset) === 2;

             return (
               <Link 
                 key={movie.id}
                 href={`/movies/${movie.slug}`}
                 onClick={(e) => {
                    if (!isCenter) {
                      e.preventDefault();
                      setCurrent(idx);
                    }
                 }}
                 className={cn(
                    "absolute transition-all duration-300 ease-in-out cursor-pointer group flex items-center justify-center",
                    isCenter ? "z-[10] opacity-100" : 
                    isNear ? "z-[5] opacity-70" : 
                    isFar ? "z-[1] opacity-40" : "opacity-0 pointer-events-none"
                 )}
                 style={{
                    transform: `translateX(${offset * (typeof window !== 'undefined' && window.innerWidth < 768 ? 130 : 200)}px)`,
                 }}
               >
                 <div 
                    className={cn(
                      "relative overflow-hidden transition-all duration-300",
                      isCenter ? "border-2 border-popcorn-red shadow-[0_20px_60px_rgba(0,0,0,0.8)]" : "border border-white/5"
                    )}
                    style={{
                      width: isCenter ? '180px' : isNear ? '150px' : '120px',
                      height: isCenter ? '270px' : isNear ? '225px' : '180px',
                      borderRadius: isCenter ? '12px' : isNear ? '10px' : '8px'
                    }}
                 >
                    {movie.cover_image && (
                      <Image 
                        src={movie.cover_image} 
                        alt={movie.title} 
                        fill 
                        className="object-cover"
                      />
                    )}
                    {/* Hover Overlay */}
                    <div className={cn(
                      "absolute inset-0 bg-popcorn-red/15 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end pb-4",
                    )}>
                       <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/10">▶ View</span>
                    </div>

                    <div className={cn(
                      "absolute inset-0 bg-black/40 transition-opacity",
                      isCenter ? "opacity-0" : "opacity-60"
                    )} />
                 </div>
               </Link>
             )
           })}

           {/* Controls */}
           <button 
             onClick={(e) => { e.stopPropagation(); prev(); }}
             className="absolute left-4 md:left-10 z-40 p-2.5 rounded-full bg-white/5 hover:bg-popcorn-red text-white transition-all backdrop-blur-md border border-white/10"
           >
             <ChevronLeft size={18} />
           </button>
           <button 
             onClick={(e) => { e.stopPropagation(); next(); }}
             className="absolute right-4 md:right-10 z-40 p-2.5 rounded-full bg-white/5 hover:bg-popcorn-red text-white transition-all backdrop-blur-md border border-white/10"
           >
             <ChevronRight size={18} />
           </button>
        </div>

        {/* Active Movie Info */}
        <div className="text-center w-full px-4 pt-2 pb-10 animate-in fade-in zoom-in duration-500 flex flex-col items-center">
           <div className="flex flex-col items-center">
              <Link href={`/movies/${activeMovie?.slug}`} className="group/title">
                <h2 className="text-[20px] lg:text-[28px] font-bold text-white tracking-normal uppercase not-italic leading-[1.3] drop-shadow-2xl max-w-[600px] text-center mb-1 group-hover/title:text-popcorn-red transition-colors duration-200 line-clamp-2">
                  {activeMovie?.title}
                </h2>
              </Link>
              
              <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[2px] mt-2 text-[#555]">
                 <span style={{ color: '#E50914' }}>{activeMovie?.category || 'Movie'}</span>
                 <span>·</span>
                 <span style={{ color: '#aaaaaa' }}>{activeMovie?.language_tag || 'English'}</span>
                 {activeMovie?.imdb_rating && (
                   <>
                     <span>·</span>
                     <div className="flex items-center" style={{ color: '#F5C518' }}>
                        <span className="mr-1">★</span>
                        <span>{activeMovie.imdb_rating.toFixed(1)}</span>
                     </div>
                   </>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>


  )
}
