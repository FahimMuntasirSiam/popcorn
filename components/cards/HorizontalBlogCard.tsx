import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { Post } from '@/types'

interface HorizontalBlogCardProps {
  post: Post;
}

export default function HorizontalBlogCard({ post }: HorizontalBlogCardProps) {
  const readingTime = Math.ceil((post.word_count || 1) / 200)

  return (
    <Link href={`/blogs/${post.slug}`} className="group block w-full">
      <div className="bg-popcorn-card/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col md:flex-row h-full md:h-72">
        {/* Image Container */}
        <div className="relative w-full md:w-2/5 h-64 md:h-full overflow-hidden shrink-0">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          ) : (
            <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
              <span className="text-gray-500 italic">No Image</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-60" />
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 flex flex-col justify-center flex-1 space-y-4">
          <div className="flex items-center space-x-4 text-[10px] font-black text-popcorn-secondary uppercase tracking-[0.2em]">
             <div className="flex items-center space-x-1">
               <Calendar size={12} className="text-popcorn-red" />
               <span>{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
             </div>
             <span className="w-1 h-1 rounded-full bg-white/10" />
             <div className="flex items-center space-x-1">
               <Clock size={12} className="text-popcorn-red" />
               <span>{readingTime} min read</span>
             </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-3xl md:text-4xl font-black text-white leading-tight line-clamp-2 group-hover:text-popcorn-red transition-colors italic uppercase tracking-tighter">
              {post.title}
            </h3>
            
            <p className="text-popcorn-secondary text-sm line-clamp-2 leading-relaxed font-medium">
              {post.meta_description}
            </p>
          </div>
          
          <div className="pt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-white group-hover:text-popcorn-red transition-colors">
               <span>Read Full Story</span>
               <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
