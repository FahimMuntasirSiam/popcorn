import { createClient } from '@/lib/supabase-server'
import MovieCard from '@/components/cards/MovieCard'
import AdUnit from '@/components/ui/AdUnit'
import FilterBar from '@/components/ui/FilterBar'
import React from 'react'

export const metadata = {
  title: 'Movies | Popcorn',
  description: 'Explore the latest trending movies, ratings, and download options.',
}

export default async function MoviesListingPage({ 
  searchParams 
}: { 
  searchParams: { lang?: string, genre?: string }
}) {
  const supabase = createClient()
  const lang = searchParams.lang
  const genre = searchParams.genre

  let query = supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', 'movies')
    .order('created_at', { ascending: false })

  if (lang) {
    query = query.eq('language_tag', lang.toLowerCase())
  }
  if (genre) {
    query = query.eq('genre', genre.toLowerCase())
  }

  const { data: posts } = await query

  // Fetch filter options
  const { data: allPosts } = await supabase
    .from('posts')
    .select('language_tag, genre')
    .eq('status', 'published')
    .eq('category', 'movies')

  const languages = Array.from(new Set(allPosts?.map(p => p.language_tag).filter(Boolean)))
  const genres = Array.from(new Set(allPosts?.map(p => p.genre).filter(Boolean)))

  return (
    <div className="bg-popcorn-dark min-h-screen text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto uppercase tracking-tighter">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div className="flex items-center space-x-4 flex-1">
          <h1 className="text-4xl md:text-6xl font-black italic">MOVIES</h1>
          <div className="h-0.5 flex-1 bg-white/5" />
        </div>
      </div>

      <FilterBar 
        languages={languages as string[]} 
        genres={genres as string[]} 
        currentLang={lang} 
        currentGenre={genre} 
        title="movies" 
      />

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {posts.map((post, index) => (
            <React.Fragment key={post.id}>
              <MovieCard movie={post} />
              
              {(index + 1) % 8 === 0 && (
                <div className="col-span-full py-4">
                  <AdUnit 
                    className="hidden md:flex" 
                    minHeight="90px"
                    code={`
                      <script type="text/javascript">
                        atOptions = {
                          'key' : '64530885a0cbc7ae0904c3e6dfc4c192',
                          'format' : 'iframe',
                          'height' : 90,
                          'width' : 728,
                          'params' : {}
                        };
                      </script>
                      <script type="text/javascript" src="https://www.highperformanceformat.com/64530885a0cbc7ae0904c3e6dfc4c192/invoke.js"></script>
                    `} 
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
          <p className="text-xl font-bold text-popcorn-secondary">No movies found matching your filters.</p>
        </div>
      )}
    </div>
  )
}
