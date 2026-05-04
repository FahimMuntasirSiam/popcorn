'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface PillFilterProps {
  count: number;
}

const LANGUAGES = [
  { label: 'All', value: '' },
  { label: 'English', value: 'english' },
  { label: 'বাংলা', value: 'bangla' },
  { label: 'Hindi', value: 'hindi' },
  { label: 'Anime', value: 'anime' },
]

export default function PillFilter({ count }: PillFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentLang = searchParams.get('lang') || ''

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
        {LANGUAGES.map((lang) => {
          const isActive = currentLang === lang.value
          return (
            <button
              key={lang.label}
              onClick={() => handleFilter(lang.value)}
              className={cn(
                "px-5 py-2 rounded-full text-[13px] transition-all duration-200 border",
                isActive 
                  ? "bg-popcorn-red border-popcorn-red text-white font-semibold" 
                  : "bg-[#1a1a1a] border-[#333] text-[#aaa] hover:border-popcorn-red hover:text-white"
              )}
            >
              {lang.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
