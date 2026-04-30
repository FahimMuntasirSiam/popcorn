import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Star, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { Post } from '@/types'
import { cn } from '@/lib/utils'

interface HorizontalBlogCardProps {
  post: Post;
}

export default function HorizontalBlogCard({ post }: HorizontalBlogCardProps) {
  const readingTime = Math.ceil((post.word_count || 1) / 200)
  const hasRating = (post.avg_rating || 0) > 0

  return (
    <Link href={`/blogs/${post.slug}`} className="group block w-full">
      <div className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden transition-all duration-300 group-hover:border-popcorn-red group-hover:shadow-[0_0_20px_rgba(229,9,20,0.15)] flex flex-col md:flex-row h-full md:h-[170px]">
        {/* Image Container - LEFT */}
        <div className="relative w-full md:w-[300px] h-[170px] shrink-0 bg-black">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="300px"
            />
          ) : (
            <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
              <span className="text-gray-700 text-xs italic">No Image</span>
            </div>
          )}
        </div>

        {/* Content - RIGHT */}
        <div className="p-5 md:p-6 flex flex-col justify-between flex-1 overflow-hidden">
          <div className="space-y-2">
            <h3 className="text-[20px] font-bold text-white leading-tight line-clamp-1 group-hover:text-popcorn-red transition-colors italic !font-serif">
              {post.title}
            </h3>
            
            <div className="flex items-center space-x-3 text-[11px] font-bold tracking-wider">
               <div className={cn("flex items-center space-x-1", hasRating ? "text-popcorn-gold" : "text-neutral-600")}>
                  <Star size={12} fill={hasRating ? "currentColor" : "none"} />
                  <span>{hasRating ? post.avg_rating?.toFixed(1) : 'Not rated'}</span>
               </div>
               <span className="text-neutral-700">•</span>
               <div className="flex items-center space-x-1 text-neutral-500">
                  <Calendar size={12} />
                  <span>{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
               </div>
               <span className="text-neutral-700">•</span>
               <div className="flex items-center space-x-1 text-neutral-500">
                  <Clock size={12} />
                  <span>{readingTime} min read</span>
               </div>
            </div>

            <p className="text-neutral-500 text-[13px] line-clamp-2 leading-relaxed font-medium">
              {post.meta_description}
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex flex-wrap gap-2">
               {(post.genre?.split(',') || []).slice(0, 2).map((g: string) => (
                 <span key={g} className="bg-popcorn-red/10 text-popcorn-red text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-popcorn-red/20">
                   {g.trim()}
                 </span>
               ))}
            </div>
            
            <div className="flex items-center space-x-1 text-[11px] font-black uppercase tracking-widest text-popcorn-red">
               <span>Read More</span>
               <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
