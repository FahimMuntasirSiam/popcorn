import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import MovieCard from '@/components/cards/MovieCard'
import BlogCard from '@/components/cards/BlogCard'
import AdUnit from '@/components/ui/AdUnit'

export default async function CategoryPage({ 
  params,
  searchParams 
}: { 
  params: { name: string },
  searchParams: { lang?: string, genre?: string }
}) {
  const supabase = createClient()
  const category = params.name
  const lang = searchParams.lang
  const genre = searchParams.genre

  let query = supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  // If the URL name matches a category, filter by category
  // Otherwise, if it matches a language tag, filter by language tag
  if (['movies', 'blogs', 'trailers'].includes(category)) {
    query = query.eq('category', category)
  } else {
    query = query.eq('language_tag', category)
  }

  if (lang) {
    query = query.eq('language_tag', lang.toLowerCase())
  }
  if (genre) {
    query = query.eq('genre', genre.toLowerCase())
  }

  const { data: posts, error } = await query

  // To show filter options, we need all unique languages and genres for this category
  const { data: allPosts } = await supabase
    .from('posts')
    .select('language_tag, genre')
    .eq('status', 'published')
    .eq('category', category)

  const languages = Array.from(new Set(allPosts?.map(p => p.language_tag).filter(Boolean)))
  const genres = Array.from(new Set(allPosts?.map(p => p.genre).filter(Boolean)))

  const isPrimaryCategory = ['movies', 'blogs', 'trailers'].includes(category)

  if (error || !posts || posts.length === 0) {
     if (!lang && !genre && !isPrimaryCategory) {
       notFound()
     }
  }

  return <CategoryView 
    title={category} 
    posts={posts || []} 
    languages={languages as string[]} 
    genres={genres as string[]}
    currentLang={lang}
    currentGenre={genre}
  />
}

function CategoryView({ 
  title, 
  posts, 
  languages, 
  genres, 
  currentLang, 
  currentGenre 
}: { 
  title: string, 
  posts: any[], 
  languages: string[], 
  genres: string[],
  currentLang?: string,
  currentGenre?: string
}) {
  return (
    <div className="bg-popcorn-dark min-h-screen text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto uppercase tracking-tighter">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="flex items-center space-x-4 flex-1">
          <h1 className="text-4xl md:text-6xl font-black italic">{title.replace('-', ' ')}</h1>
          <div className="h-0.5 flex-1 bg-white/5" />
        </div>
        
        <div className="flex flex-wrap gap-3">
          {(currentLang || currentGenre) && (
            <Link 
              href={`/category/${title}`}
              className="text-[10px] font-black bg-popcorn-red text-white px-4 py-2 rounded-full hover:bg-white hover:text-popcorn-red transition-all shadow-lg shadow-popcorn-red/20"
            >
              Clear Filters
            </Link>
          )}
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-12 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
        {languages.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] font-black text-popcorn-secondary tracking-[0.2em]">Languages</p>
            <div className="flex flex-wrap gap-2">
              {languages.map(l => (
                <Link
                  key={l}
                  href={`/category/${title}?lang=${l}${currentGenre ? `&genre=${currentGenre}` : ''}`}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black transition-all border",
                    currentLang === l 
                      ? "bg-white text-black border-white" 
                      : "bg-white/5 text-white border-white/10 hover:border-white/40"
                  )}
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>
        )}

        {genres.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] font-black text-popcorn-secondary tracking-[0.2em]">Genres</p>
            <div className="flex flex-wrap gap-2">
              {genres.map(g => (
                <Link
                  key={g}
                  href={`/category/${title}?genre=${g}${currentLang ? `&lang=${currentLang}` : ''}`}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black transition-all border",
                    currentGenre === g 
                      ? "bg-white text-black border-white" 
                      : "bg-white/5 text-white border-white/10 hover:border-white/40"
                  )}
                >
                  {g}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {posts.map((post, index) => (
            <React.Fragment key={post.id}>
              {post.category === 'blogs' ? (
                <BlogCard post={post} />
              ) : (
                <MovieCard movie={post} />
              )}
              
              {(index + 1) % 6 === 0 && (
                <div className="col-span-full">
                  <AdUnit type="banner" position={`category_${title}_after_${index + 1}`} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
          <p className="text-xl font-bold text-popcorn-secondary">No items found matching your filters.</p>
        </div>
      )}
    </div>
  )
}

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'