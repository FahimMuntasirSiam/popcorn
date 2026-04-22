'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Play, Download } from 'lucide-react'
import { Post } from '@/types'

interface HeroProps {
  movie: Post;
}

export default function Hero({ movie }: HeroProps) {
  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        {movie.cover_image && (
          <Image
            src={movie.cover_image}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-popcorn-dark via-popcorn-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-popcorn-dark via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-24">
        <div className="max-w-2xl space-y-6">
          <div className="flex items-center space-x-2">
            <span className="bg-popcorn-red text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">Featured</span>
            <span className="text-popcorn-gold text-sm font-bold flex items-center">
              #{movie.category.replace('-', ' ')}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight">
            {movie.title}
          </h1>
          
          <p className="text-gray-300 text-base md:text-xl line-clamp-3 leading-relaxed max-w-xl">
            {movie.meta_description}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link 
              href={`/movies/${movie.slug}`}
              className="bg-popcorn-red text-white px-8 py-3 rounded-md font-bold flex items-center hover:bg-neutral-100 hover:text-popcorn-red transition-all shadow-xl group"
            >
              <Play fill="currentColor" size={20} className="mr-2 group-hover:scale-110 transition-transform" />
              Read More
            </Link>
            
            <Link 
              href={`/download/${movie.slug}`}
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-3 rounded-md font-bold flex items-center hover:bg-white/20 transition-all shadow-xl"
            >
              <Download size={20} className="mr-2" />
              Download
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
