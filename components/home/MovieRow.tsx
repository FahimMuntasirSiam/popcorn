'use client'

import Link from 'next/link'
import MovieCard from '@/components/cards/MovieCard'
import { Post } from '@/types'
import { ChevronRight } from 'lucide-react'

interface MovieRowProps {
  title: string;
  movies: Post[];
  viewMoreLink?: string;
}

export default function MovieRow({ title, movies, viewMoreLink }: MovieRowProps) {
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
           <MovieCard key={movie.id} movie={movie} variant="grid" />
        ))}
      </div>
    </section>
  )
}

