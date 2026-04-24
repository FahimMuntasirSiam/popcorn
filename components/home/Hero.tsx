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
    <div className="relative w-full h-[85vh] md:h-[95vh] overflow-hidden bg-popcorn-dark flex flex-col items-center justify-center pt-20">
      {/* Fixed Premium Backdrop */}
      <div className="absolute inset-0">
        <Image
          src="/premium_hero.png"
          alt="Premium Banner"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-popcorn-dark via-popcorn-dark/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-popcorn-dark/60 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center space-y-12">
        
        {/* Cover Flow Carousel */}
        <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
           {movies.map((movie, idx) => {
             // Calculate position relative to current
             let offset = idx - current;
             if (offset > 2) offset -= movies.length;
             if (offset < -2) offset += movies.length;

             const isCenter = idx === current;
             const isNear = Math.abs(offset) === 1;
             const isFar = Math.abs(offset) === 2;

             return (
               <div 
                 key={movie.id}
                 onClick={() => setCurrent(idx)}
                 className={cn(
                    "absolute transition-all duration-700 ease-out cursor-pointer group",
                    isCenter ? "z-30 scale-110 opacity-100" : 
                    isNear ? "z-20 scale-90 opacity-60" : 
                    isFar ? "z-10 scale-75 opacity-20" : "opacity-0 pointer-events-none"
                 )}
                 style={{
                    transform: `translateX(${offset * (typeof window !== 'undefined' && window.innerWidth < 768 ? 120 : 250)}px)`,
                 }}
               >
                 <div className={cn(
                    "relative aspect-[2/3] w-48 md:w-64 rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border-2 transition-all duration-500",
                    isCenter ? "border-popcorn-red shadow-popcorn-red/20" : "border-white/5 hover:border-white/20"
                 )}>
                    {movie.cover_image && (
                      <Image 
                        src={movie.cover_image} 
                        alt={movie.title} 
                        fill 
                        className="object-cover"
                      />
                    )}
                    <div className={cn(
                      "absolute inset-0 bg-black/40 transition-opacity",
                      isCenter ? "opacity-0" : "opacity-60"
                    )} />
                 </div>
                 
                 {/* Stats below card like in reference */}
                 {isCenter && (
                    <div className="mt-6 flex justify-center items-center space-x-4 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-500">
                       <span className="text-green-500">154</span>
                       <span className="text-white/20">|</span>
                       <span className="text-popcorn-red">0</span>
                       <span className="text-white/20">|</span>
                       <span className="text-popcorn-gold">603</span>
                    </div>
                 )}
               </div>
             )
           })}

           {/* Controls */}
           <button 
             onClick={(e) => { e.stopPropagation(); prev(); }}
             className="absolute left-4 md:left-20 z-40 p-4 rounded-full bg-white/5 hover:bg-popcorn-red text-white transition-all backdrop-blur-md border border-white/10"
           >
             <ChevronLeft size={24} />
           </button>
           <button 
             onClick={(e) => { e.stopPropagation(); next(); }}
             className="absolute right-4 md:right-20 z-40 p-4 rounded-full bg-white/5 hover:bg-popcorn-red text-white transition-all backdrop-blur-md border border-white/10"
           >
             <ChevronRight size={24} />
           </button>
        </div>

        {/* Active Movie Info */}
        <div className="text-center space-y-6 max-w-4xl px-4 animate-in fade-in zoom-in duration-500">
           <div className="flex flex-col items-center space-y-4">
              <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none drop-shadow-2xl">
                {activeMovie?.title}
              </h2>
              <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] text-popcorn-secondary">
                 <span className="text-popcorn-red">{activeMovie?.category || 'Movie'}</span>
                 <span className="w-1 h-1 rounded-full bg-white/20" />
                 <span>{activeMovie?.language_tag || 'English'}</span>
                 <span className="w-1 h-1 rounded-full bg-white/20" />
                 <div className="flex items-center text-popcorn-gold">
                    <Star size={12} className="fill-current mr-1" />
                    <span>7.5</span>
                 </div>
              </div>
           </div>

           <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto line-clamp-2">
             {activeMovie?.meta_description}
           </p>

           <div className="flex justify-center gap-4 pt-4">
              <Link 
                href={`/movies/${activeMovie.slug}`}
                className="bg-white text-popcorn-dark px-10 py-3.5 rounded-2xl font-black uppercase tracking-widest flex items-center hover:bg-popcorn-red hover:text-white transition-all shadow-2xl text-[10px]"
              >
                <Play fill="currentColor" size={14} className="mr-2" />
                Read More
              </Link>
              <Link 
                href={`/download/${activeMovie.slug}`}
                className="bg-white/10 backdrop-blur-xl text-white border border-white/20 px-10 py-3.5 rounded-2xl font-black uppercase tracking-widest flex items-center hover:bg-white/20 transition-all shadow-2xl text-[10px]"
              >
                <Download size={14} className="mr-2" />
                Get Link
              </Link>
           </div>
        </div>
      </div>
    </div>
  )
}
