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
    <Link href={`/movies/${movie.slug}`} className="group block">
      <div className="bg-popcorn-card rounded-xl overflow-hidden hover-scale shadow-lg">
        <div className="relative aspect-[2/3] w-full">
          {movie.cover_image ? (
            <Image
              src={movie.cover_image}
              alt={movie.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            />
          ) : (
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
              <span className="text-gray-500 italic">No Poster</span>
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-popcorn-red p-4 rounded-full shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play fill="white" className="text-white" size={32} />
            </div>
          </div>

          {/* Language Badge */}
          <div className="absolute top-2 left-2">
            <span className={`${getLanguageColor(movie.language_tag)} text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-md text-white`}>
              {movie.language_tag}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-popcorn-red transition-colors">
            {movie.title}
          </h3>
          <StarRating rating={movie.avg_rating || 0} />
        </div>
      </div>
    </Link>
  )
}
