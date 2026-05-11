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
  const hasRating = (post.imdb_rating || 0) > 0

  return (
    <Link href={`/blogs/${post.slug}`} className="group block w-full max-w-[860px] mx-auto">
      <div className="bg-[#141414] border border-[#1f1f1f] rounded-[10px] overflow-hidden transition-all duration-300 hover:border-popcorn-red flex flex-col md:flex-row h-full md:h-[165px]">
        {/* Image Container - LEFT */}
        <div className="relative w-full md:w-[280px] h-[165px] shrink-0 bg-black">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-l-[10px]"
              sizes="(max-width: 768px) 100vw, 280px"
            />
          ) : (
            <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
              <span className="text-gray-700 text-xs italic">No Image</span>
            </div>
          )}
        </div>

        {/* Content - RIGHT */}
        <div className="p-4 md:p-6 flex flex-col justify-between flex-1 overflow-hidden">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white leading-tight line-clamp-1 group-hover:text-popcorn-red transition-colors uppercase tracking-tight">
              {post.title}
            </h3>
            
            <div className="flex items-center space-x-3 text-[11px] font-bold tracking-wider">
               {hasRating && (
                 <>
                   <div className="flex items-center space-x-1 text-popcorn-gold">
                      <Star size={12} fill="currentColor" />
                      <span>{post.imdb_rating?.toFixed(1)}</span>
                   </div>
                   <span className="text-neutral-700">•</span>
                 </>
               )}
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
                 <span key={g} className="bg-transparent text-popcorn-red text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-popcorn-red">
                   {g.trim()}
                 </span>
               ))}
            </div>
            
            <div className="flex items-center space-x-1 text-[12px] font-black uppercase tracking-widest text-popcorn-red">
               <span>Read More</span>
               <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
