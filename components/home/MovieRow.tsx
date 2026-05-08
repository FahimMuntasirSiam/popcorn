'use client'

import { useRef } from 'react'
import Link from 'next/link'
import MovieCard from '@/components/cards/MovieCard'
import { Post } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MovieRowProps {
  title: string;
  movies: Post[];
  viewMoreLink?: string;
}

export default function MovieRow({ title, movies, viewMoreLink }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  if (movies.length === 0) return null;

  return (
    <section className="space-y-8 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            {title}
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-popcorn-red to-transparent rounded-full" />
        </div>
        
        {viewMoreLink && (
          <Link 
            href={viewMoreLink}
            className="group flex items-center space-x-2 bg-white/5 hover:bg-popcorn-red text-white px-6 py-2 rounded-full border border-white/10 transition-all text-[10px] font-black uppercase tracking-widest shadow-xl"
          >
            <span>View More</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      <div className="relative group/row">
        {/* Navigation Arrows */}
        <button 
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/60 hover:bg-popcorn-red text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover/row:opacity-100 hidden md:flex shadow-2xl"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div 
          ref={scrollRef}
          className="flex flex-row overflow-x-auto gap-4 pb-2 scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
             <MovieCard key={movie.id} movie={movie} variant="fixed" />
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/60 hover:bg-popcorn-red text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover/row:opacity-100 hidden md:flex shadow-2xl"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  )
}
