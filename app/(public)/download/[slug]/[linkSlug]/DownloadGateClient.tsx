'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Loader2, ArrowLeft, X, Film, Globe, Tag, Calendar, Star } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Post, DownloadLink } from '@/types'
import AdUnit from '@/components/ui/AdUnit'

interface DownloadGateClientProps {
  post: Post;
  link: DownloadLink;
  slug: string;
  linkSlug: string;
}

export default function DownloadGateClient({ post, link, slug, linkSlug }: DownloadGateClientProps) {
  const [timeLeft, setTimeLeft] = useState(15)
  const [isCountingDown, setIsCountingDown] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState('')
  const [startTime] = useState(Date.now())
  
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setToken(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          setIsCountingDown(false)
          setIsReady(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [])

  const handleDownload = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/get-download-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postSlug: slug,
          linkSlug,
          token,
          timestamp: startTime
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Link expired. Please try again.')
      }

      window.open(data.url, '_blank')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const radius = 60
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (timeLeft / 15) * circumference

  if (error) {
    return (
      <div className="max-w-[480px] mx-auto py-20 px-6 text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
          <X className="text-red-500" size={40} />
        </div>
        <div className="space-y-2">
           <h2 className="text-xl font-bold text-white">Download Failed</h2>
           <p className="text-sm text-popcorn-secondary">{error}</p>
        </div>
        <Link 
          href={`/movies/${slug}`}
          className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-white bg-white/5 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={14} />
          <span>Go Back</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-64px)]">
      
      {/* LEFT COLUMN (60%): Backdrop & Details */}
      <div className="relative flex-1 lg:w-[60%] bg-[#0a0a0a] border-r border-white/5">
        {/* Blurred Backdrop */}
        <div className="absolute inset-0 z-0">
          {post.cover_image && (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              sizes="100vw"
              className="object-cover blur-[100px] opacity-20"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 lg:p-12 h-full flex flex-col max-w-[800px] mx-auto">
           {/* LEFT TOP AD */}
           <div id="ad-download-left-top" className="w-full min-h-[250px] bg-[#141414] rounded-xl mb-8 overflow-hidden flex items-center justify-center ad-container">
              <AdUnit 
                minHeight={250}
                code={`<script type="text/javascript" src="https://pl29300532.profitablecpmratenetwork.com/cb/84/86/cb84861c3dec1995f49a5b34cd3e2a06.js"></script>`}
              />
           </div>

           {/* MOVIE DETAILS CARD */}
           <div className="bg-[#141414] border border-white/5 rounded-2xl p-8 space-y-6 shadow-2xl">
              <h3 className="text-[12px] text-[#E50914] font-bold tracking-[3px] uppercase pb-4 border-b border-white/5 flex items-center gap-2">
                 <Film size={14} /> MOVIE DETAILS
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1">
                    <span className="text-[11px] text-[#666] font-bold uppercase tracking-wider">Original Title</span>
                    <p className="text-white font-bold">{post.title}</p>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[11px] text-[#666] font-bold uppercase tracking-wider">Language</span>
                    <p className="text-white font-bold flex items-center gap-2 uppercase">
                       <Globe size={14} className="text-[#E50914]" /> {post.language_tag}
                    </p>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[11px] text-[#666] font-bold uppercase tracking-wider">Genre</span>
                    <p className="text-white font-bold flex items-center gap-2">
                       <Tag size={14} className="text-[#E50914]" /> {post.genre || '--'}
                    </p>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[11px] text-[#666] font-bold uppercase tracking-wider">Release Year</span>
                    <p className="text-white font-bold flex items-center gap-2">
                       <Calendar size={14} className="text-[#E50914]" /> {new Date(post.created_at).getFullYear()}
                    </p>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[11px] text-[#666] font-bold uppercase tracking-wider">IMDb Rating</span>
                    <p className="text-[#F5C518] font-black flex items-center gap-2">
                       <Star size={14} className="fill-current" /> {post.imdb_rating ? `${post.imdb_rating}/10` : '--'}
                    </p>
                 </div>
              </div>
           </div>

           {/* LEFT BOTTOM AD */}
           <div id="ad-download-left-bottom" className="w-full min-h-[250px] bg-[#141414] rounded-xl mt-8 overflow-hidden flex items-center justify-center ad-container">
              <AdUnit 
                minHeight={250}
                code={`<script type="text/javascript" src="https://pl29300532.profitablecpmratenetwork.com/cb/84/86/cb84861c3dec1995f49a5b34cd3e2a06.js"></script>`}
              />
           </div>
        </div>
      </div>

      {/* RIGHT COLUMN (40%): Action Gate */}
      <div className="lg:w-[40%] bg-[#0d0d0d] p-6 lg:p-12 flex flex-col items-center">
        {/* MOVIE INFO */}
        <div className="flex flex-col items-center space-y-4 mb-8">
           <div className="relative w-[120px] h-[180px] rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-white/10">
              {post.cover_image && (
                <Image 
                  src={post.cover_image} 
                  alt={post.title} 
                  fill 
                  sizes="120px"
                  className="object-cover"
                />
              )}
           </div>
           <h1 className="text-lg font-[700] text-white text-center max-w-[280px]">
             {post.title}
           </h1>
           <div className="flex items-center gap-3">
              <span className="bg-[#E50914] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {link.quality}
              </span>
              <span className="bg-white/5 text-[#aaa] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/5">
                {link.size || '--'}
              </span>
           </div>
        </div>

        {/* AD UNIT 1 (TOP) */}
        <div id="ad-download-top" className="w-full mb-8 flex flex-col items-center ad-container">
           <AdUnit 
              className="hidden lg:flex" 
              minHeight={90}
              code={`
                <script type="text/javascript">
                  atOptions = { 'key' : '64530885a0cbc7ae0904c3e6dfc4c192', 'format' : 'iframe', 'height' : 90, 'width' : 728, 'params' : {} };
                </script>
                <script type="text/javascript" src="https://www.highperformanceformat.com/64530885a0cbc7ae0904c3e6dfc4c192/invoke.js"></script>
              `} 
            />
            <AdUnit 
              className="lg:hidden flex" 
              minHeight={50}
              code={`
                <script type="text/javascript">
                  atOptions = { 'key' : '2b58bfa05eeeaedde521d109142d97e3', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };
                </script>
                <script type="text/javascript" src="https://www.highperformanceformat.com/2b58bfa05eeeaedde521d109142d97e3/invoke.js"></script>
              `} 
            />
        </div>

        {/* COUNTDOWN / DOWNLOAD BUTTON */}
        <div className="w-full max-w-[340px] flex flex-col items-center">
           {isCountingDown ? (
              <div className="flex flex-col items-center space-y-6">
                 <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        fill="transparent"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="6"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        fill="transparent"
                        stroke="#E50914"
                        strokeWidth="6"
                        strokeLinecap="round"
                        style={{
                          strokeDasharray: circumference,
                          strokeDashoffset: strokeDashoffset,
                          transition: 'stroke-dashoffset 1s linear'
                        }}
                      />
                    </svg>
                    <span className="text-3xl font-black text-white">{timeLeft}</span>
                 </div>
                 <p className="text-[11px] text-[#666] font-bold tracking-[3px] uppercase animate-pulse">PREPARING YOUR DOWNLOAD...</p>

                 {/* AD UNIT 2 (DURING COUNTDOWN) */}
                 <div className="w-[300px] h-[250px] bg-[#141414] rounded-xl overflow-hidden mt-4 shadow-2xl animate-in fade-in duration-500 mx-auto ad-container">
                    <AdUnit 
                      minHeight={250}
                      code={`<script type="text/javascript" src="https://pl29300532.profitablecpmratenetwork.com/cb/84/86/cb84861c3dec1995f49a5b34cd3e2a06.js"></script>`}
                    />
                 </div>
              </div>
           ) : (
              <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center">
                 <button
                   disabled={isLoading}
                   onClick={handleDownload}
                   className={cn(
                     "w-full h-[52px] bg-[#E50914] text-white rounded-[10px] font-bold text-[16px] flex items-center justify-center space-x-3 shadow-[0_4px_20px_rgba(229,9,20,0.4)] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all",
                     isLoading && "opacity-80 cursor-not-allowed"
                   )}
                 >
                   {isLoading ? (
                     <Loader2 size={24} className="animate-spin" />
                   ) : (
                     <>
                       <span>⬇ DOWNLOAD NOW</span>
                     </>
                   )}
                 </button>
                 <p className="text-[11px] text-[#555] mt-4 font-medium">⚠️ Link expires in 10 minutes</p>
              </div>
           )}
        </div>
      </div>

      {/* BOTTOM BANNER AD */}
      <div className="w-full bg-[#141414] border-t border-white/5 py-4 ad-container">
         <div className="max-w-7xl mx-auto px-6">
            <AdUnit 
              minHeight={90}
              className="flex justify-center"
              code={`
                <script type="text/javascript">
                  atOptions = { 'key' : '64530885a0cbc7ae0904c3e6dfc4c192', 'format' : 'iframe', 'height' : 90, 'width' : 728, 'params' : {} };
                </script>
                <script type="text/javascript" src="https://www.highperformanceformat.com/64530885a0cbc7ae0904c3e6dfc4c192/invoke.js"></script>
              `} 
            />
         </div>
      </div>
    </div>
  )
}
