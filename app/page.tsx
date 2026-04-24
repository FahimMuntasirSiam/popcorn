'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'
import Hero from '@/components/home/Hero'
import MovieRow from '@/components/home/MovieRow'
import BlogGrid from '@/components/home/BlogGrid'
import { Post } from '@/types'
import AdUnit from '@/components/ui/AdUnit'

export default function Home() {
  const [trending, setTrending] = useState<Post[]>([])
  const [trailers, setTrailers] = useState<Post[]>([])
  const [blogs, setBlogs] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      
      // Fetch Trending (mix of reviews and news)
      const { data: trendingData } = await supabase
        .from('posts')
        .select('*')
        .in('category', ['review', 'movie-blog', 'movies', 'blogs'])
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(10)
      
      // Fetch Trailers
      const { data: trailersData } = await supabase
        .from('posts')
        .select('*')
        .in('category', ['trailer', 'trailers'])
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(10)
      
      // Fetch Latest Blogs
      const { data: blogData } = await supabase
        .from('posts')
        .select('*')
        .in('category', ['movie-news', 'blogs', 'movie-blog'])
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6)

      setTrending(trendingData || [])
      setTrailers(trailersData || [])
      setBlogs(blogData || [])
      setLoading(false)
    }

    fetchData()
  }, [supabase])

  const featuredMovie = trending[0] || trailers[0]

  return (
    <div className="pb-20">
      {featuredMovie && <Hero movie={featuredMovie} />}
      <div className="space-y-12 mt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <MovieRow 
          title="Trending Movies" 
          movies={trending} 
          loading={loading} 
        />

        <AdUnit type="banner" position="home_after_first_row" />
        
        <MovieRow 
          title="Latest Trailers" 
          movies={trailers} 
          loading={loading} 
        />

        <BlogGrid 
          title="Latest Blog Posts" 
          posts={blogs} 
          loading={loading} 
        />
        
        <MovieRow 
          title="New Releases" 
          movies={trending.slice().reverse()} 
          loading={loading} 
        />
      </div>
    </div>
  )
}
