'use client'

import Link from 'next/link'
import MovieCard from '@/components/cards/MovieCard'
import { Post } from '@/types'

interface MovieRowProps {
  title: string;
  movies: Post[];
  loading?: boolean;
}

export default function MovieRow({ title, movies, loading }: MovieRowProps) {
  if (!loading && movies.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between border-l-4 border-popcorn-red pl-4">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">
          {title}
        </h2>
        <Link 
          href={`/category/${title.toLowerCase().replace(' ', '-')}`}
          className="text-popcorn-secondary hover:text-popcorn-red text-xs font-bold uppercase tracking-widest transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="relative group">
        <div className="flex overflow-x-auto overflow-y-hidden gap-4 pb-6 no-scrollbar snap-x scroll-smooth">
          {loading ? (
             [...Array(6)].map((_, i) => (
              <div key={i} className="min-w-[160px] md:min-w-[200px] aspect-[2/3] bg-popcorn-card animate-pulse rounded-xl" />
            ))
          ) : (
            movies.map((movie) => (
              <div key={movie.id} className="min-w-[160px] md:min-w-[200px] snap-start">
                <MovieCard movie={movie} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
