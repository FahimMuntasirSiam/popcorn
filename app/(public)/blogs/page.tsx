import { createClient } from '@/lib/supabase-server'
import HorizontalBlogCard from '@/components/cards/HorizontalBlogCard'
import AdUnit from '@/components/ui/AdUnit'
import React from 'react'

export const metadata = {
  title: 'Blogs | Popcorn',
  description: 'Read the latest movie news, reviews, and editorial stories.',
}

export default async function BlogsListingPage() {
  const supabase = createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', 'blogs')
    .order('created_at', { ascending: false })

  const count = posts?.length || 0

  return (
    <div className="bg-popcorn-dark min-h-screen text-white pt-12 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto">
      <div className="max-w-[860px] mx-auto">
        <div className="mb-10">
          <h1 className="text-[28px] font-[800] text-white uppercase tracking-[2px] leading-none mb-1">
            BLOGS
          </h1>
          <p className="text-[#666] text-[13px] font-medium tracking-[1px] uppercase">
            {count} Articles
          </p>
          <div className="w-[40px] h-[3px] bg-[#E50914] rounded-[2px] mt-2 mb-6" />
        </div>

        {posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <React.Fragment key={post.id}>
                <HorizontalBlogCard post={post} />
                
                {(index + 1) % 4 === 0 && (
                  <div className="py-4">
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
          <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[2rem] bg-white/2">
            <p className="text-lg font-bold text-neutral-600 uppercase tracking-widest">No blogs published yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
