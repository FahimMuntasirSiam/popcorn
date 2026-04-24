import { createClient } from '@/lib/supabase-server'
import MovieCard from '@/components/cards/MovieCard'
import BlogCard from '@/components/cards/BlogCard'
import React from 'react'

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || ''
  const supabase = createClient()

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .ilike('title', `%${query}%`)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-popcorn-dark min-h-screen text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center space-x-4 mb-12">
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
          Search: <span className="text-popcorn-red">{query}</span>
        </h1>
        <div className="h-0.5 flex-1 bg-white/5" />
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {posts.map((post) => (
            <React.Fragment key={post.id}>
              {post.category === 'blogs' ? (
                <BlogCard post={post} />
              ) : (
                <MovieCard movie={post} />
              )}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <p className="text-2xl font-bold text-popcorn-secondary">No results found for "{query}"</p>
          <p className="text-sm text-neutral-500">Try searching for something else or check your spelling.</p>
        </div>
      )}
    </div>
  )
}
