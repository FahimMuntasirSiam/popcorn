'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Download, ChevronRight, Star } from 'lucide-react'
import { Post } from '@/types'
import { cn } from '@/lib/utils'

interface HeroProps {
  movies: Post[];
}

export default function Hero({ movies }: HeroProps) {
  const [current, setCurrent] = useState(0)

  if (!movies.length) return null
  const activeMovie = movies[current]

  return (
    <div className="relative w-full min-h-[85vh] md:h-[95vh] overflow-hidden bg-popcorn-dark flex flex-col justify-center">
      {/* Premium Generated Backdrop */}
      <div className="absolute inset-0">
        <Image
          src="/premium_movie_hero_backdrop_1777034708324.png"
          alt="Banner"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-popcorn-dark via-popcorn-dark/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-popcorn-dark/80 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Main Content (Left side) */}
        <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left duration-700">
           <div className="flex items-center space-x-3">
              <div className="bg-popcorn-red text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.3em] shadow-2xl flex items-center">
                 <Star size={12} className="mr-2 fill-white" />
                 Editor's Pick
              </div>
              <span className="text-popcorn-gold text-[10px] font-black uppercase tracking-[0.2em]">Trending Now</span>
           </div>

           <div className="space-y-4">
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase italic transition-all duration-500">
                {activeMovie.title}
              </h1>
              <p className="text-gray-400 text-lg md:text-xl line-clamp-2 max-w-xl font-medium leading-relaxed">
                {activeMovie.meta_description}
              </p>
           </div>

           <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                href={`/movies/${activeMovie.slug}`}
                className="bg-white text-popcorn-dark px-12 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center hover:bg-popcorn-red hover:text-white transition-all shadow-2xl shadow-white/5 group text-xs"
              >
                <Play fill="currentColor" size={18} className="mr-3" />
                Read Story
              </Link>
              
              <Link 
                href={`/download/${activeMovie.slug}`}
                className="bg-white/10 backdrop-blur-xl text-white border border-white/20 px-12 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center hover:bg-white/20 transition-all shadow-2xl text-xs"
              >
                <Download size={18} className="mr-3" />
                Get Link
              </Link>
           </div>
        </div>

        {/* Featured Cards (Right side) */}
        <div className="lg:col-span-5 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Up Next</h3>
              <div className="h-px flex-1 bg-white/10 mx-6" />
           </div>

           <div className="grid grid-cols-1 gap-4">
              {movies.map((movie, idx) => (
                <button
                  key={movie.id}
                  onClick={() => setCurrent(idx)}
                  className={cn(
                    "group relative flex items-center p-3 rounded-3xl transition-all duration-500 border overflow-hidden",
                    idx === current 
                      ? "bg-white/10 border-white/20 shadow-2xl translate-x-4" 
                      : "bg-transparent border-transparent hover:bg-white/5 hover:translate-x-2"
                  )}
                >
                  <div className="relative w-20 h-28 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                    {movie.cover_image && (
                      <Image 
                        src={movie.cover_image} 
                        alt={movie.title} 
                        fill 
                        className="object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                  </div>
                  
                  <div className="ml-6 text-left space-y-2">
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-widest transition-colors",
                      idx === current ? "text-popcorn-red" : "text-white/40"
                    )}>
                      {movie.category}
                    </p>
                    <h4 className="text-white font-bold text-lg line-clamp-1 group-hover:text-popcorn-red transition-colors capitalize">
                      {movie.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                       <span>{movie.language_tag}</span>
                       <span className="w-1 h-1 rounded-full bg-white/20" />
                       <div className="flex items-center text-popcorn-gold">
                          <Star size={10} className="fill-current mr-1" />
                          <span>7.5</span>
                       </div>
                    </div>
                  </div>

                  {idx === current && (
                    <div className="absolute right-4 text-white/20">
                      <ChevronRight size={32} />
                    </div>
                  )}
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}
