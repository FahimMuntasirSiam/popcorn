import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'
import { format } from 'date-fns'
import { Post } from '@/types'

interface TrailerCardProps {
  post: Post;
}

export default function TrailerCard({ post }: TrailerCardProps) {
  const getYoutubeId = (url: string | null) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const videoId = getYoutubeId(post.trailer_url)
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : post.cover_image

  return (
    <Link href={`/trailers/${post.slug}`} className="group block bg-[#141414] rounded-[10px] overflow-hidden border border-[#1f1f1f] hover:border-popcorn-red transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 bg-[#E50914]/80 text-white rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
            <Play size={20} fill="white" />
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-1">
         <h3 className="text-sm font-bold text-white group-hover:text-popcorn-red transition-colors line-clamp-1 uppercase tracking-tight">
           {post.title}
         </h3>
         <p className="text-[12px] font-medium text-neutral-500">
           {format(new Date(post.created_at), 'MMM dd, yyyy')}
         </p>
      </div>
    </Link>
  )
}
