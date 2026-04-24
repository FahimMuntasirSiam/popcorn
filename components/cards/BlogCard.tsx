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
      <div className="bg-popcorn-card rounded-xl overflow-hidden hover-scale flex flex-col sm:flex-row h-full shadow-lg border border-white/5">
        <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
            />
          ) : (
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
              <span className="text-gray-500 italic">No Content</span>
            </div>
          )}
          
          <div className="absolute top-2 left-2">
            <span className="bg-popcorn-red text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-md text-white">
              {post.category}
            </span>
          </div>
        </div>

        <div className="p-5 flex flex-col justify-between grow">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-popcorn-red transition-colors capitalize">
              {post.title}
            </h3>
            <p className="text-popcorn-secondary text-sm line-clamp-2 mb-4 leading-relaxed">
              {post.meta_description}
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center text-xs text-popcorn-secondary space-x-2">
              <Calendar size={12} />
              <span>{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
            </div>
            
            <div className="flex items-center text-popcorn-red text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Read More</span>
              <ArrowRight size={16} className="ml-1" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
