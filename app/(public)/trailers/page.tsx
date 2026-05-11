import { createClient } from '@/lib/supabase-server'
import TrailerCard from '@/components/cards/TrailerCard'
import AdUnit from '@/components/ui/AdUnit'
import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Trailers | Popcorn',
  description: 'Watch the latest movie trailers and teasers in high quality.',
}

export const revalidate = 1800

export default async function TrailersListingPage() {
  const supabase = createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', 'trailers')
    .order('created_at', { ascending: false })

  const count = posts?.length || 0

  return (
    <div className="bg-popcorn-dark min-h-screen text-white pt-12 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-[28px] font-[800] text-white uppercase tracking-[2px] leading-none mb-1">
          TRAILERS
        </h1>
        <p className="text-[#666] text-[13px] font-medium tracking-[1px] uppercase">
          {count} Trailers
        </p>
        <div className="w-[40px] h-[3px] bg-[#E50914] rounded-[2px] mt-2 mb-6" />
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-20">
          {posts.map((post, index) => (
            <React.Fragment key={post.id}>
              <TrailerCard post={post} />
              
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
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <span className="text-[48px] mb-4">🎬</span>
          <h3 className="text-white text-[18px] font-[600] mt-4">No trailers yet</h3>
          <p className="text-[#666] text-[14px] mt-2 mb-8">Check back soon for the latest movie trailers</p>
          <Link 
            href="/movies"
            className="bg-[#E50914] text-white px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-popcorn-red transition-all shadow-2xl"
          >
            Browse Movies →
          </Link>
        </div>
      )}
    </div>
  )
}
