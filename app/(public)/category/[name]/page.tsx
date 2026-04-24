import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import MovieCard from '@/components/cards/MovieCard'
import BlogCard from '@/components/cards/BlogCard'
import AdUnit from '@/components/ui/AdUnit'
import FilterBar from '@/components/ui/FilterBar'

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

  // Handle category mapping for backward compatibility
  if (category === 'movies') {
    query = query.in('category', ['movies', 'review'])
  } else if (category === 'blogs') {
    query = query.in('category', ['blogs', 'movie-blog', 'movie-news'])
  } else if (category === 'trailers') {
    query = query.in('category', ['trailers', 'trailer', 'teaser'])
  } else {
    // If not a primary category, try matching language_tag
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
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div className="flex items-center space-x-4 flex-1">
          <h1 className="text-4xl md:text-6xl font-black italic">{title.replace('-', ' ')}</h1>
          <div className="h-0.5 flex-1 bg-white/5" />
        </div>
      </div>

      <FilterBar 
        languages={languages} 
        genres={genres} 
        currentLang={currentLang} 
        currentGenre={currentGenre} 
        title={title} 
      />

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