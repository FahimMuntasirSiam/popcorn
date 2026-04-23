import React from 'react'
import { Info, Shield, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="bg-popcorn-dark min-h-screen text-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6 space-y-16">
        
        {/* Header */}
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-popcorn-red/10 rounded-2xl mb-4 text-popcorn-red">
            <Info size={32} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">About Popcorn</h1>
          <p className="text-popcorn-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            Your premium destination for the latest movies, trailers, and reviews. We bring the cinema experience straight to your screen.
          </p>
        </header>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12">
          <section className="bg-popcorn-card/40 border border-white/5 p-10 rounded-[2.5rem] space-y-4">
             <div className="text-popcorn-red font-black uppercase text-xs tracking-[0.3em]">Our Mission</div>
             <h2 className="text-2xl font-black">Connecting Movie Lovers</h2>
             <p className="text-popcorn-secondary text-sm leading-relaxed">
               Popcorn was built with one goal: to create a seamless, beautiful hub for the global film community. We believe information should be accessible and visually stunning.
             </p>
          </section>

          <section className="bg-popcorn-card/40 border border-white/5 p-10 rounded-[2.5rem] space-y-4">
             <div className="text-popcorn-gold font-black uppercase text-xs tracking-[0.3em]">The Tech</div>
             <h2 className="text-2xl font-black">Modern Experience</h2>
             <p className="text-popcorn-secondary text-sm leading-relaxed">
               Powered by Next.js 14 and Supabase, we provide lightning-fast performance, real-time updates, and a secure environment for all our users.
             </p>
          </section>Section Content
        </div>

        <section className="text-center py-20 border-t border-white/5">
           <Heart className="mx-auto text-popcorn-red mb-6 animate-pulse" size={48} />
           <h2 className="text-3xl font-black mb-4">Built for Fans</h2>
           <p className="text-popcorn-secondary max-w-xl mx-auto">
             Whether you&apos;re looking for the newest trailer or a community review, Popcorn is here for you. Thank you for being part of our story.
           </p>
        </section>

      </div>
    </div>
  )
}
