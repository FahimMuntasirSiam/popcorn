'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Download, Loader2, ArrowLeft, ExternalLink, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import MovieCard from '@/components/cards/MovieCard'
import { Post, DownloadLink } from '@/types'

interface DownloadGateProps {
  movie: Post
  linkSlug: string
  relatedMovies: Post[]
}

export default function DownloadGate({ movie, linkSlug, relatedMovies }: DownloadGateProps) {
  const [timeLeft, setTimeLeft] = useState(15)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [timestamp] = useState(Date.now())
  const [isFinished, setIsFinished] = useState(false)

  const selectedLink = movie.download_links.find(l => l.slug === linkSlug) || movie.download_links[0]

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
        setProgress(prev => Math.min(prev + (100 / 15), 100))
      }, 1000)
      return () => clearInterval(timer)
    } else {
      setIsFinished(true)
      setProgress(100)
    }
  }, [timeLeft])

  const handleGetLink = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/get-download-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postSlug: movie.slug,
          linkSlug: selectedLink?.slug,
          timestamp: timestamp
        })
      })

      const data = await res.json()
      if (res.ok && data.url) {
        setDownloadUrl(data.url)
        window.open(data.url, '_blank')
        toast.success('Redirecting to download...')
      } else {
        toast.error(data.error || 'Failed to retrieve link. Please try again.')
      }
    } catch (err) {
      toast.error('An error occurred. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-popcorn-dark min-h-screen text-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Back Link */}
        <Link 
          href={`/movies/${movie.slug}`}
          className="flex items-center space-x-2 text-popcorn-secondary hover:text-white transition-colors mb-8 group w-fit"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Movie</span>
        </Link>

        {/* Info Card */}
        <div className="bg-popcorn-card border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Download size={120} className="text-white" />
           </div>

           <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
              <div className="w-40 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 shrink-0">
                 {movie.cover_image && (
                   <Image src={movie.cover_image} alt={movie.title} width={160} height={240} className="object-cover" />
                 )}
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-4">
                 <div className="space-y-1">
                    <span className="text-popcorn-red text-[10px] font-black uppercase tracking-[0.2em]">{selectedLink?.quality || 'High Quality'}</span>
                    <h1 className="text-3xl md:text-4xl font-black">{movie.title}</h1>
                 </div>
                 <p className="text-popcorn-secondary font-medium">Your request for <b className="text-white">"{selectedLink?.label}"</b> is being processed. Please wait a moment.</p>
              </div>
           </div>

           <div className="mt-12 space-y-8">
              {/* Ad Placeholder 1 */}
              <div className="w-full bg-white/5 border border-dashed border-white/10 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[150px]">
                 <!-- ADSTERRA AD UNIT HERE -->
                 <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-widest mb-2">Advertisement</span>
                 <p className="text-xs text-neutral-600">Enjoy some news while you wait</p>
              </div>

              {/* Countdown Section */}
              <div className="flex flex-col items-center justify-center space-y-6">
                 {!isFinished ? (
                   <>
                    <div className="relative w-32 h-32 flex items-center justify-center">
                       <svg className="absolute inset-0 w-full h-full -rotate-10" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                          <circle 
                            cx="50" cy="50" r="45" 
                            stroke="#E50914" 
                            strokeWidth="8" 
                            fill="none"
                            strokeDasharray="283"
                            strokeDashoffset={283 - (progress * 2.83)}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-linear"
                          />
                       </svg>
                       <span className="text-5xl font-black text-popcorn-red italic">{timeLeft}</span>
                    </div>
                    <div className="w-full max-w-md bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                       <div 
                        className="bg-popcorn-red h-full transition-all duration-1000 ease-linear" 
                        style={{ width: `${progress}%` }}
                       />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-popcorn-secondary animate-pulse italic">Verifying Request...</p>
                   </>
                 ) : (
                   <button
                    onClick={handleGetLink}
                    disabled={loading}
                    className="group relative inline-flex items-center space-x-4 bg-popcorn-red text-white px-16 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-white hover:text-popcorn-red transition-all shadow-[0_0_50px_rgba(229,9,20,0.3)] hover:shadow-[0_0_70px_rgba(255,255,255,0.2)] transform hover:-translate-y-1 active:scale-95"
                   >
                     {loading ? (
                        <Loader2 className="animate-spin" size={24} />
                     ) : (
                       <>
                        <Download size={24} className="group-hover:bounce" />
                        <span>⬇️ Download Now</span>
                       </>
                     )}
                   </button>
                 )}
              </div>

              {/* Tips Section */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex items-start space-x-4">
                 <AlertCircle className="text-popcorn-gold shrink-0 mt-1" size={18} />
                 <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase tracking-widest text-white">How to Download?</h4>
                    <p className="text-[11px] text-popcorn-secondary leading-relaxed">After the timer ends, click the red button. If the link doesn't open automatically, please disable your pop-up blocker or click the button again.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Ad Placeholder 2 */}
        <div className="mt-12 w-full bg-white/5 border border-dashed border-white/10 rounded-2xl p-4 text-center">
           <!-- ADSTERRA AD UNIT HERE -->
           <span className="text-[8px] font-black text-neutral-800 uppercase tracking-widest">Sponsored Content</span>
        </div>

        {/* Related Content */}
        <section className="mt-20 space-y-10">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">More movies like this</h2>
              <div className="h-0.5 flex-1 mx-8 bg-white/5" />
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedMovies.length > 0 ? (
                relatedMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))
              ) : (
                <p className="col-span-full text-center text-popcorn-secondary italic py-10">No related movies found.</p>
              )}
           </div>
        </section>

      </div>
    </div>
  )
}
