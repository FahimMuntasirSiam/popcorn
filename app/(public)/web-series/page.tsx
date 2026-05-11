import { createClient } from '@/lib/supabase-server'
import MovieCard from '@/components/cards/MovieCard'
import AdUnit from '@/components/ui/AdUnit'
import PillFilter from '@/components/ui/PillFilter'
import React, { Suspense } from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Web Series | Popcorn',
  description: 'Explore the latest trending web series, ratings, and download options.',
}

export const revalidate = 1800

export default async function WebSeriesListingPage({ 
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
    .eq('category', 'web-series')
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
          WEB SERIES
        </h1>
        <p className="text-[#666] text-[13px] font-medium tracking-[1px] uppercase">
          {posts?.length || 0} Web Series
        </p>
        <div className="w-[40px] h-[3px] bg-[#E50914] rounded-[2px] mt-2 mb-6" />
      </div>

      {/* Filter Section */}
      <Suspense fallback={<div className="h-20 bg-white/5 animate-pulse rounded-2xl mb-8" />}>
        <PillFilter count={posts?.length || 0} category="web-series" />
      </Suspense>

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
                    minHeight={90}
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
             <span className="text-4xl">📺</span>
          </div>
          <h3 className="text-2xl font-bold text-white uppercase tracking-tight">
             No {lang ? lang : ''} web series yet. Check back soon!
          </h3>
          <Link 
            href="/web-series"
            className="bg-popcorn-red text-white px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-popcorn-red transition-all shadow-2xl"
          >
            View All Web Series
          </Link>
        </div>
      )}
    </div>
  )
}
