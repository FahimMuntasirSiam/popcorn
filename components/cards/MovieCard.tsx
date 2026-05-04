import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'
import StarRating from '@/components/ui/StarRating'
import { Post, LanguageTag } from '@/types'

interface MovieCardProps {
  movie: Post;
}

const languageColors: Record<string, string> = {
  english: 'bg-red-600',
  bangla: 'bg-green-600',
  hindi: 'bg-blue-600',
  chinese: 'bg-orange-600',
  anime: 'bg-purple-600',
}

const getLanguageColor = (lang: string) => {
  return languageColors[lang.toLowerCase()] || 'bg-gray-600'
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.slug}`} className="group block w-[220px] h-[330px] flex-shrink-0">
      <div className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg transition-transform duration-200 hover:scale-[1.04] h-full flex flex-col">
        <div className="relative w-full h-[260px]">
          {movie.cover_image ? (
            <Image
              src={movie.cover_image}
              alt={movie.title}
              fill
              className="object-cover object-top transition-transform duration-500"
              sizes="220px"
            />
          ) : (
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
              <span className="text-gray-500 italic">No Poster</span>
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-popcorn-red p-3 rounded-full shadow-xl">
              <Play fill="white" className="text-white" size={24} />
            </div>
          </div>

          {/* Language Badge */}
          <div className="absolute top-2 left-2">
            <span className={`${getLanguageColor(movie.language_tag)} text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-md text-white`}>
              {movie.language_tag}
            </span>
          </div>
        </div>

        <div className="h-[70px] p-[10px_12px] flex flex-col justify-center bg-[#1a1a1a]">
          <h3 className="font-bold text-white text-[13px] line-clamp-1 group-hover:text-popcorn-red transition-colors mb-1">
            {movie.title}
          </h3>
          {movie.imdb_rating && (
            <div className="flex items-center text-[#F5C518] text-[12px] font-bold">
               <span className="mr-1">★</span>
               <span>{movie.imdb_rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
