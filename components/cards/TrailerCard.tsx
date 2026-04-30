import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'
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
    <Link href={`/trailers/${post.slug}`} className="group block">
      <div className="space-y-4">
        <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-popcorn-red/20">
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt={post.title}
              fill
              className="object-contain transition-transform duration-700 group-hover:scale-110"
            />
          )}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 bg-popcorn-red text-white rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
              <Play size={32} fill="currentColor" />
            </div>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
             <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl inline-block">
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Trailer</span>
             </div>
          </div>
        </div>
        
        <div className="px-2 space-y-1">
           <h3 className="text-xl font-black text-white italic uppercase tracking-tighter group-hover:text-popcorn-red transition-colors line-clamp-1">
             {post.title}
           </h3>
           <p className="text-[10px] font-bold text-popcorn-secondary uppercase tracking-widest">
             {post.language_tag} • {post.genre || 'Action'}
           </p>
        </div>
      </div>
    </Link>
  )
}
