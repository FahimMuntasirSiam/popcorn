'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { Post } from '@/types'
import { cn } from '@/lib/utils'

interface HeroProps {
  movies: Post[];
}

export default function Hero({ movies }: HeroProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (movies.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [movies.length])

  if (!movies.length) return null

  return (
    <div className="relative w-full h-[75vh] md:h-[90vh] overflow-hidden group">
      {movies.map((movie, idx) => (
        <div 
          key={movie.id}
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-in-out transform",
            idx === current ? "opacity-100 scale-100 z-10" : "opacity-0 scale-110 z-0 pointer-events-none"
          )}
        >
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0">
            {movie.cover_image && (
              <Image
                src={movie.cover_image}
                alt={movie.title}
                fill
                className="object-cover"
                priority={idx === 0}
                sizes="100vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-popcorn-dark via-popcorn-dark/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-popcorn-dark via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-32">
            <div className={cn(
              "max-w-2xl space-y-6 transition-all duration-700 delay-300",
              idx === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            )}>
              <div className="flex items-center space-x-2">
                <span className="bg-popcorn-red text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">Featured</span>
                <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                  {movie.category}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] italic uppercase">
                {movie.title}
              </h1>
              
              <p className="text-gray-300 text-sm md:text-lg line-clamp-3 leading-relaxed max-w-xl font-medium">
                {movie.meta_description}
              </p>

              <div className="flex flex-wrap gap-4 pt-6">
                <Link 
                  href={`/movies/${movie.slug}`}
                  className="bg-popcorn-red text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest flex items-center hover:bg-white hover:text-popcorn-red transition-all shadow-2xl shadow-popcorn-red/20 group text-xs"
                >
                  <Play fill="currentColor" size={16} className="mr-2 group-hover:scale-110 transition-transform" />
                  Read More
                </Link>
                
                <Link 
                  href={`/download/${movie.slug}`}
                  className="bg-white/10 backdrop-blur-xl text-white border border-white/20 px-10 py-4 rounded-xl font-black uppercase tracking-widest flex items-center hover:bg-white/20 transition-all shadow-2xl text-xs"
                >
                  <Download size={16} className="mr-2" />
                  Download
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {movies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={cn(
              "h-1.5 transition-all duration-500 rounded-full",
              idx === current ? "w-8 bg-popcorn-red" : "w-3 bg-white/20 hover:bg-white/40"
            )}
          />
        ))}
      </div>

      {/* Side Controls (Hidden on mobile, show on hover) */}
      <button 
        onClick={() => setCurrent((prev) => (prev - 1 + movies.length) % movies.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 bg-black/20 hover:bg-popcorn-red text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={() => setCurrent((prev) => (prev + 1) % movies.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 bg-black/20 hover:bg-popcorn-red text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  )
}
