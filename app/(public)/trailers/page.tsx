import { createClient } from '@/lib/supabase-server'
import TrailerCard from '@/components/cards/TrailerCard'
import AdUnit from '@/components/ui/AdUnit'
import React from 'react'

export const metadata = {
  title: 'Trailers | Popcorn',
  description: 'Watch the latest movie trailers and teasers in high quality.',
}

export default async function TrailersListingPage() {
  const supabase = createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', 'trailers')
    .order('created_at', { ascending: false })

  return (
    <div className="bg-popcorn-dark min-h-screen text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto uppercase tracking-tighter">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="flex items-center space-x-4 flex-1">
          <h1 className="text-4xl md:text-6xl font-black italic">TRAILERS</h1>
          <div className="h-0.5 flex-1 bg-white/5" />
        </div>
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post, index) => (
            <React.Fragment key={post.id}>
              <TrailerCard post={post} />
              
              {(index + 1) % 6 === 0 && (
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
          <p className="text-xl font-bold text-popcorn-secondary">No trailers found.</p>
        </div>
      )}
    </div>
  )
}
