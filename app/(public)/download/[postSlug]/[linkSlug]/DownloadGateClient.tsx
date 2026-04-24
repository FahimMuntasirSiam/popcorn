'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Post, DownloadLink } from '@/types'

interface DownloadGateClientProps {
  post: Post;
  link: DownloadLink;
  postSlug: string;
  linkSlug: string;
}

export default function DownloadGateClient({ post, link, postSlug, linkSlug }: DownloadGateClientProps) {
  const [timeLeft, setTimeLeft] = useState(15)
  const [isCountingDown, setIsCountingDown] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState('')
  const [startTime] = useState(Date.now())
  
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Generate a random session token
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
          postSlug,
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

  // SVG Circle Constants
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (timeLeft / 15) * circumference

  if (error) {
    return (
      <div className="bg-popcorn-card border border-white/5 rounded-[2rem] p-10 text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
          <X className="text-red-500" size={40} />
        </div>
        <div className="space-y-2">
           <h2 className="text-xl font-bold text-white">Download Failed</h2>
           <p className="text-sm text-popcorn-secondary">{error}</p>
        </div>
        <Link 
          href={`/movies/${postSlug}`}
          className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-white bg-white/5 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={14} />
          <span>Go Back</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-popcorn-card border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header Info */}
      <div className="p-8 pb-4 space-y-6 text-center">
        <div className="relative w-32 h-44 mx-auto rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          {post.cover_image && (
            <Image 
              src={post.cover_image} 
              alt={post.title} 
              fill 
              className="object-cover"
            />
          )}
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold italic text-white leading-tight font-serif" style={{ fontFamily: 'Palatino, "Palatino Linotype", "Palatino LT STD", "Book Antiqua", Georgia, serif' }}>
            {post.title}
          </h1>
          <div className="flex items-center justify-center space-x-3">
            <span className="bg-popcorn-red text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-popcorn-red/20">
              {link.quality}
            </span>
            {link.size && (
              <span className="text-[10px] font-black text-popcorn-secondary uppercase tracking-[0.2em]">
                {link.size}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Countdown / Ad Area */}
      <div className="p-8 pt-4 space-y-8">
        <div className="relative flex items-center justify-center h-48">
          {isCountingDown ? (
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="8"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#E50914"
                  strokeWidth="8"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset,
                    transition: 'stroke-dashoffset 1s linear'
                  }}
                />
              </svg>
              <div className="text-4xl font-black italic text-white animate-pulse">
                {timeLeft}
              </div>
            </div>
          ) : (
            <button
              disabled={isLoading}
              onClick={handleDownload}
              className={cn(
                "w-full h-20 bg-popcorn-red text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center space-x-3 shadow-2xl shadow-popcorn-red/40 hover:scale-[1.02] active:scale-[0.98] transition-all group",
                isLoading && "opacity-80 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  <span className="text-xl">⬇️</span>
                  <span>Download Now</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="text-center">
           <p className={cn(
             "text-[10px] font-black uppercase tracking-[0.3em] transition-opacity duration-500",
             isCountingDown ? "text-popcorn-secondary opacity-100" : "opacity-0"
           )}>
             Preparing your download...
           </p>
        </div>

        {/* Ad Placeholder */}
        <div className={cn(
          "transition-all duration-700",
          isReady ? "opacity-0 scale-95 pointer-events-none absolute invisible" : "opacity-100 scale-100"
        )}>
          <div 
            id="ad-download-gate" 
            data-position="download-gate"
            style={{
              width: '300px', 
              height: '250px', 
              margin: '0 auto',
              background: '#141414', 
              border: '1px solid #222',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderRadius: '24px'
            }}
          >
            <span style={{ color: '#444', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Advertisement
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
