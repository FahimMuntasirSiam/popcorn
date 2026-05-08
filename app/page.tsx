'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Hero from '@/components/home/Hero'
import MovieRow from '@/components/home/MovieRow'
import { Post } from '@/types'
import AdUnit from '@/components/ui/AdUnit'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [featured, setFeatured] = useState<Post[]>([])
  const [latest, setLatest] = useState<Post[]>([])
  const [movies, setMovies] = useState<Post[]>([])
  const [webSeries, setWebSeries] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      
      // 1. Fetch Featured (limit 10)
      const { data: featuredData } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(10)

      // 2. Fetch Latest 4 (Anything)
      const { data: latestData } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(4)

      // 3. Fetch Movies (10)
      const { data: moviesData } = await supabase
        .from('posts')
        .select('*')
        .eq('category', 'movies')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(10)

      // 3.5 Fetch Web Series (10)
      const { data: webSeriesData } = await supabase
        .from('posts')
        .select('*')
        .eq('category', 'web-series')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(10)
      


      setFeatured(featuredData || [])
      setLatest(latestData || [])
      setMovies(moviesData || [])
      setWebSeries(webSeriesData || [])
      setLoading(false)
    }

    fetchData()
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-popcorn-dark">
        <Loader2 className="animate-spin text-popcorn-red" size={48} />
      </div>
    )
  }

  return (
    <div className="pb-24 bg-popcorn-dark">
      {/* Featured Hero Carousel */}
      {featured.length > 0 && <Hero movies={featured} />}

      <div className="space-y-24 mt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        <MovieRow 
          title="Trending Movies" 
          movies={movies} 
          viewMoreLink="/movies"
        />

        {/* Web Series Section */}
        {webSeries.length > 0 && (
          <MovieRow 
            title="WEB SERIES" 
            movies={webSeries} 
            viewMoreLink="/web-series"
          />
        )}



        <div className="space-y-4">
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
          <AdUnit 
            className="md:hidden flex" 
            minHeight="50px"
            code={`
              <script type="text/javascript">
                atOptions = {
                  'key' : '2b58bfa05eeeaedde521d109142d97e3',
                  'format' : 'iframe',
                  'height' : 50,
                  'width' : 320,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="https://www.highperformanceformat.com/2b58bfa05eeeaedde521d109142d97e3/invoke.js"></script>
            `} 
          />
        </div>


      </div>
    </div>
  )
}

