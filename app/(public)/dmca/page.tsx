import React from 'react'
import { Gavel, ShieldAlert, FileText } from 'lucide-react'

export default function DMCAPage() {
  return (
    <div className="bg-popcorn-dark min-h-screen text-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        
        {/* Header */}
        <header className="space-y-4">
          <div className="inline-flex items-center space-x-3 text-popcorn-red">
            <Gavel size={32} />
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">DMCA Policy</h1>
          </div>
          <p className="text-popcorn-secondary font-medium border-l-2 border-popcorn-red pl-4">
            Popcorn Hub respects the intellectual property rights of others and expects its users to do the same.
          </p>
        </header>

        {/* Content */}
        <article className="prose prose-invert prose-red max-w-none space-y-10">
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center">
              <ShieldAlert size={20} className="mr-2 text-popcorn-red" />
              1. Content & Responsibility
            </h2>
            <p className="text-sm text-popcorn-secondary leading-relaxed">
              Popcorn Hub is an information-sharing platform and does not host any video files or copyrighted content on its own servers. We provide information, trailers, and links to third-party content that is already publicly available on the internet.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center">
              <FileText size={20} className="mr-2 text-popcorn-red" />
              2. Notice of Copyright Infringement
            </h2>
            <p className="text-sm text-popcorn-secondary leading-relaxed">
              If you believe that your copyrighted work is being used in a way that constitutes copyright infringement, please provide our Copyright Agent with a written notice containing:
            </p>
            <ul className="text-xs space-y-2 list-disc pl-5 text-popcorn-secondary">
              <li>A description of the copyrighted work that you claim has been infringed.</li>
              <li>A description of where the material you claim is infringing is located.</li>
              <li>Your contact information including address, phone number, and email.</li>
              <li>A statement by you that the information in your notice is accurate.</li>
            </ul>
          </section>

          <section className="bg-popcorn-card border border-white/5 p-8 rounded-3xl mt-12">
             <h3 className="text-sm font-black uppercase tracking-widest mb-4">Contact Agent</h3>
             <p className="text-xs text-popcorn-secondary">
               Please send all DMCA notices to: <br />
               <b className="text-white mt-2 block">fahimmuntasirsiam@gmail.com</b>
             </p>
          </section>
        </article>

      </div>
    </div>
  )
}
