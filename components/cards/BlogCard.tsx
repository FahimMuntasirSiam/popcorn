import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { Post } from '@/types'

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <div className="bg-popcorn-card/40 backdrop-blur-md rounded-[2rem] overflow-hidden transition-all duration-500 hover:translate-y-[-8px] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/5 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
            />
          ) : (
            <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
              <span className="text-gray-500 italic">No Image</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-4 left-4">
            <span className="bg-popcorn-red/90 backdrop-blur-md text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl text-white">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col flex-1">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[10px] font-black text-popcorn-secondary uppercase tracking-[0.2em]">
               <Calendar size={12} className="text-popcorn-red" />
               <span>{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
            </div>
            
            <h3 className="text-2xl font-black text-white leading-tight line-clamp-2 group-hover:text-popcorn-red transition-colors italic uppercase tracking-tighter">
              {post.title}
            </h3>
            
            <p className="text-popcorn-secondary text-xs line-clamp-3 leading-relaxed font-medium">
              {post.meta_description}
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-white group-hover:text-popcorn-red transition-colors">
               <span>Read Story</span>
               <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-popcorn-red transition-all">
               <span className="text-lg leading-none">+</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
