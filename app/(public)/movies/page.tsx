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
    <div className="bg-popcorn-dark min-h-screen text-white pt-12 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-[28px] font-[800] text-white uppercase tracking-[2px] leading-none mb-1">
          MOVIES
        </h1>
        <p className="text-[#666] text-[13px] font-medium tracking-[1px] uppercase">
          {posts?.length || 0} Movies
        </p>
        <div className="w-[40px] h-[3px] bg-[#E50914] rounded-[2px] mt-2 mb-6" />
      </div>

      {/* Filter Section */}
      <PillFilter count={posts?.length || 0} />

      {/* Grid Section */}
      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
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
