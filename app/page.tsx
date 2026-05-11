import { createClient } from '@/lib/supabase-server'
import Hero from '@/components/home/Hero'
import MovieRow from '@/components/home/MovieRow'
import { Post } from '@/types'
import AdUnit from '@/components/ui/AdUnit'

export const revalidate = 3600 // revalidate every hour

export default async function Home() {
  const supabase = createClient()

  // 1. Fetch Featured Movies (limit 10)
  const { data: featuredMovies } = await supabase
    .from('posts')
    .select('*')
    .eq('category', 'movies')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('updated_at', { ascending: false })
    .limit(10)

  // 2. Fetch Latest 5 Movies (Fallback)
  const { data: latestMovies } = await supabase
    .from('posts')
    .select('*')
    .eq('category', 'movies')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(5)

  // 3. Fetch Movies (15)
  const { data: moviesData } = await supabase
    .from('posts')
    .select('*')
    .eq('category', 'movies')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(15)

  // 3.5 Fetch Web Series (15)
  const { data: webSeriesData } = await supabase
    .from('posts')
    .select('*')
    .eq('category', 'web-series')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(15)

  const carouselMovies = (featuredMovies && featuredMovies.length > 0)
    ? featuredMovies
    : (latestMovies || [])

  const movies = moviesData || []
  const webSeries = webSeriesData || []

  return (
    <div className="pb-24 bg-popcorn-dark">
      {/* Featured Hero Carousel */}
      {carouselMovies.length > 0 && <Hero movies={carouselMovies} />}

      <div className="space-y-24 mt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        <MovieRow 
          title="Trending Movies" 
          movies={movies} 
          viewMoreLink="/movies"
          priority={true}
        />

        {/* Web Series Section */}
        {webSeries.length > 0 && (
          <MovieRow 
            title="WEB SERIES" 
            movies={webSeries} 
            viewMoreLink="/web-series"
          />
        )}

        <div className="space-y-4 ad-container">
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
          <AdUnit 
            className="md:hidden flex" 
            minHeight={50}
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


