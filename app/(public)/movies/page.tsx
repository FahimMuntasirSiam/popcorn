import { createClient } from '@/lib/supabase-server'
import MovieCard from '@/components/cards/MovieCard'
import AdUnit from '@/components/ui/AdUnit'
import PillFilter from '@/components/ui/PillFilter'
import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Movies | Popcorn',
  description: 'Explore the latest trending movies, ratings, and download options.',
}

export default async function MoviesListingPage({ 
  searchParams 
}: { 
  searchParams: { lang?: string }
}) {
  const supabase = createClient()
  const lang = searchParams.lang

  let query = supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', 'movies')
    .order('created_at', { ascending: false })

  if (lang) {
    query = query.eq('language_tag', lang.toLowerCase())
  }

  const { data: posts } = await query

  return (
    <div className="bg-popcorn-dark min-h-screen text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col mb-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-1.5 h-10 bg-popcorn-red rounded-full" />
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter" style={{ fontFamily: 'Palatino, "Palatino Linotype", "Palatino LT STD", "Book Antiqua", Georgia, serif' }}>
            MOVIES
          </h1>
        </div>
      </div>

      {/* Filter Section */}
      <PillFilter count={posts?.length || 0} />

      {/* Grid Section */}
      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8 pb-20">
          {posts.map((post, index) => (
            <React.Fragment key={post.id}>
              <MovieCard movie={post} />
              
              {(index + 1) % 12 === 0 && (
                <div className="col-span-full py-8 border-y border-white/5 my-4">
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
        <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-4">
             <span className="text-4xl">🎬</span>
          </div>
          <h3 className="text-2xl font-bold text-white uppercase tracking-tight">
             No {lang ? lang : ''} movies yet. Check back soon!
          </h3>
          <Link 
            href="/movies"
            className="bg-popcorn-red text-white px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-popcorn-red transition-all shadow-2xl"
          >
            View All Movies
          </Link>
        </div>
      )}
    </div>
  )
}
