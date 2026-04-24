'use client'

import { useState } from 'react'
import { Filter, ChevronDown, Check, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  languages: string[];
  genres: string[];
  currentLang?: string;
  currentGenre?: string;
  title: string;
}

export default function FilterBar({ languages, genres, currentLang, currentGenre, title }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const activeCount = (currentLang ? 1 : 0) + (currentGenre ? 1 : 0)

  return (
    <div className="relative mb-12">
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center space-x-3 px-6 py-3 rounded-2xl border transition-all font-black uppercase tracking-widest text-[10px]",
            isOpen || activeCount > 0 
              ? "bg-white text-black border-white shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]" 
              : "bg-white/5 text-white border-white/10 hover:border-white/20"
          )}
        >
          <Filter size={14} className={activeCount > 0 ? "text-popcorn-red" : ""} />
          <span>Filters {activeCount > 0 && `(${activeCount})`}</span>
          <ChevronDown size={14} className={cn("transition-transform duration-300", isOpen ? "rotate-180" : "")} />
        </button>

        {activeCount > 0 && (
          <Link 
            href={`/category/${title}`}
            className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-popcorn-secondary hover:text-white transition-all bg-white/5 px-4 py-3 rounded-2xl border border-white/10"
          >
            <X size={12} />
            <span>Clear All</span>
          </Link>
        )}
      </div>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-transparent" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-4 z-50 w-full max-w-sm bg-popcorn-card border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-xl">
            <div className="p-6 space-y-8">
              {/* Languages */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-popcorn-secondary uppercase tracking-[0.2em] px-1">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {languages.length > 0 ? languages.map(l => (
                    <Link
                      key={l}
                      href={`/category/${title}?lang=${l}${currentGenre ? `&genre=${currentGenre}` : ''}`}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black transition-all border flex items-center space-x-2",
                        currentLang === l 
                          ? "bg-popcorn-red text-white border-popcorn-red shadow-lg shadow-popcorn-red/20" 
                          : "bg-white/5 text-white border-white/10 hover:border-white/20"
                      )}
                    >
                      {currentLang === l && <Check size={10} />}
                      <span className="capitalize">{l}</span>
                    </Link>
                  )) : (
                    <p className="text-[10px] text-neutral-600 italic px-1">No languages available</p>
                  )}
                </div>
              </div>

              {/* Genres */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-popcorn-secondary uppercase tracking-[0.2em] px-1">Genres</p>
                <div className="flex flex-wrap gap-2">
                  {genres.length > 0 ? genres.map(g => (
                    <Link
                      key={g}
                      href={`/category/${title}?genre=${g}${currentLang ? `&lang=${currentLang}` : ''}`}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black transition-all border flex items-center space-x-2",
                        currentGenre === g 
                          ? "bg-popcorn-red text-white border-popcorn-red shadow-lg shadow-popcorn-red/20" 
                          : "bg-white/5 text-white border-white/10 hover:border-white/20"
                      )}
                    >
                      {currentGenre === g && <Check size={10} />}
                      <span className="capitalize">{g}</span>
                    </Link>
                  )) : (
                    <p className="text-[10px] text-neutral-600 italic px-1">No genres available</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/2 border-t border-white/5 flex justify-end">
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[10px] font-black uppercase tracking-widest text-white hover:text-popcorn-red transition-all px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
