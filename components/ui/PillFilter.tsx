'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useLanguages } from '@/components/providers/LanguageProvider'

interface PillFilterProps {
  count: number;
}

export default function PillFilter({ count }: PillFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentLang = searchParams.get('lang') || ''
  const { languages } = useLanguages()

  const handleFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('lang', value)
    } else {
      params.delete('lang')
    }
    router.push(`/movies?${params.toString()}`)
  }

  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm font-medium tracking-tight">
          Showing <span className="text-white font-bold">{count}</span> movies
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => handleFilter('')}
          className={cn(
            "px-5 py-2 rounded-full text-[13px] transition-all duration-200 border",
            currentLang === '' 
              ? "bg-popcorn-red border-popcorn-red text-white font-semibold" 
              : "bg-[#1a1a1a] border-[#333] text-[#aaa] hover:border-popcorn-red hover:text-white"
          )}
        >
          All
        </button>
        {languages.map((lang) => {
          const isActive = currentLang === lang.slug
          return (
            <button
              key={lang.slug}
              onClick={() => handleFilter(lang.slug)}
              className={cn(
                "px-5 py-2 rounded-full text-[13px] transition-all duration-200 border",
                isActive 
                  ? "bg-popcorn-red border-popcorn-red text-white font-semibold" 
                  : "bg-[#1a1a1a] border-[#333] text-[#aaa] hover:border-popcorn-red hover:text-white"
              )}
            >
              {lang.flag} {lang.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
