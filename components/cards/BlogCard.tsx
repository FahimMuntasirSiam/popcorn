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
    <Link href={`/blogs/${post.slug}`} className="group block">
      <div className="bg-[#141414] rounded-xl overflow-hidden border border-[#222] transition-all duration-300 hover:border-popcorn-red h-full flex flex-col">
        {/* Image Container */}
        <div className="relative h-[180px] w-full overflow-hidden">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
              <span className="text-gray-500 italic">No Image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="bg-popcorn-red text-[9px] font-bold px-2 py-0.5 rounded text-white uppercase tracking-wider">
                Blogs
              </span>
              <span className="text-[11px] text-gray-500 font-medium">
                {format(new Date(post.created_at), 'MMM dd, yyyy')}
              </span>
            </div>
            
            <h3 className="text-[15px] font-bold text-white leading-[1.4] line-clamp-2 group-hover:text-popcorn-red transition-colors mt-2">
              {post.title}
            </h3>
            
            <p className="text-gray-400 text-[12px] line-clamp-2 leading-relaxed mt-1">
              {post.meta_description}
            </p>
          </div>
          
          <div className="mt-3 flex items-center text-[12px] font-bold text-popcorn-red">
             <span>Read Story →</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
