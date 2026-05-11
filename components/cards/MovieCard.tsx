import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'
import { Post } from '@/types'
import { cn } from '@/lib/utils'

interface MovieCardProps {
  movie: Post;
  className?: string;
  variant?: 'grid' | 'fixed';
  priority?: boolean;
}

export default function MovieCard({ movie, className, variant = 'grid', priority = false }: MovieCardProps) {
  const isFixed = variant === 'fixed';

  return (
    <Link 
      href={`/movies/${movie.slug}`} 
      className={cn(
        "group block bg-[#141414] rounded-[10px] overflow-hidden border border-[#1f1f1f] hover:border-popcorn-red transition-all duration-200",
        isFixed ? "w-[180px] min-w-[180px] max-w-[180px] shrink-0 grow-0 hover:scale-[1.04]" : "w-full hover:scale-[1.03]",
        className
      )}
    >
      <div className={cn(
        "relative overflow-hidden",
        isFixed ? "w-[180px] h-[270px]" : "aspect-[2/3] w-full"
      )}>
        {movie.cover_image ? (
          <Image
            src={movie.cover_image}
            alt={movie.title}
            fill
            className="object-cover object-top block"
            sizes={isFixed ? "180px" : "(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 180px"}
            priority={priority}
          />
        ) : (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
            <span className="text-gray-500 italic">No Poster</span>
          </div>
        )}
        
        {/* Language Badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-popcorn-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[3px] shadow-lg uppercase">
            {movie.language_tag}
          </span>
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-popcorn-red p-2.5 rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
            <Play fill="white" className="text-white" size={18} />
          </div>
        </div>
      </div>

      <div className="p-[10px_12px_12px] w-full">
        <h3 className={cn(
          "font-bold text-white group-hover:text-popcorn-red transition-colors mb-1 uppercase tracking-tight",
          isFixed ? "text-[12px] whitespace-nowrap overflow-hidden text-overflow-ellipsis max-w-[156px]" : "text-[13px] line-clamp-1"
        )}>
          {movie.title}
        </h3>
        {movie.imdb_rating && (
          <div className="flex items-center text-[#F5C518] text-[11px] font-bold">
             <span className="mr-1">★</span>
             <span>{movie.imdb_rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
