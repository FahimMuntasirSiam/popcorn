'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'
import Hero from '@/components/home/Hero'
import MovieRow from '@/components/home/MovieRow'
import { Post } from '@/types'
import AdUnit from '@/components/ui/AdUnit'
import MovieCard from '@/components/cards/MovieCard'
import BlogCard from '@/components/cards/BlogCard'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [featured, setFeatured] = useState<Post[]>([])
  const [latest, setLatest] = useState<Post[]>([])
  const [movies, setMovies] = useState<Post[]>([])
  const [blogs, setBlogs] = useState<Post[]>([])
  const [trailers, setTrailers] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      
      // 1. Fetch Featured (limit 5)
      const { data: featuredData } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(5)

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
        .in('category', ['movies', 'review'])
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(10)
      
      // 4. Fetch Blogs (10)
      const { data: blogData } = await supabase
        .from('posts')
        .select('*')
        .in('category', ['blogs', 'movie-blog', 'movie-news'])
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(10)

      // 5. Fetch Trailers (10)
      const { data: trailersData } = await supabase
        .from('posts')
        .select('*')
        .in('category', ['trailers', 'trailer'])
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(10)

      setFeatured(featuredData || [])
      setLatest(latestData || [])
      setMovies(moviesData || [])
      setBlogs(blogData || [])
      setTrailers(trailersData || [])
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
        
        {/* Latest Uploads (4 cards) */}
        <section className="space-y-8">
           <div className="flex items-center space-x-4">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Latest Uploads</h2>
              <div className="h-1 flex-1 bg-gradient-to-r from-popcorn-red to-transparent rounded-full" />
           </div>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {latest.map(post => (
                ['blogs', 'movie-blog', 'movie-news'].includes(post.category) ? (
                  <BlogCard key={post.id} post={post} />
                ) : (
                  <MovieCard key={post.id} movie={post} />
                )
              ))}
           </div>
        </section>

        <AdUnit type="banner" position="home_after_latest" />

        {/* Movies Section */}
        <MovieRow 
          title="Trending Movies" 
          movies={movies} 
          viewMoreLink="/category/movies"
        />

        {/* Blogs Section */}
        <MovieRow 
          title="Latest Blog Posts" 
          movies={blogs} 
          viewMoreLink="/category/blogs"
          isBlog
        />

        <AdUnit type="banner" position="home_after_blogs" />

        {/* Trailers Section */}
        <MovieRow 
          title="Trailers & Teasers" 
          movies={trailers} 
          viewMoreLink="/category/trailers"
        />
      </div>
    </div>
  )
}

