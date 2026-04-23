import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import MovieCard from '@/components/cards/MovieCard'
import BlogCard from '@/components/cards/BlogCard'
import AdUnit from '@/components/ui/AdUnit'

export default async function CategoryPage({ params }: { params: { name: string } }) {
  const supabase = createClient()
  const category = params.name

  // Fetch posts for this category
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('category', category)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error || !posts || posts.length === 0) {
    // If not found as category, try language tag
    const { data: langPosts } = await supabase
      .from('posts')
      .select('*')
      .eq('language_tag', category)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      
    if (!langPosts || langPosts.length === 0) {
      notFound()
    }
    return <CategoryView title={category} posts={langPosts} />
  }

  return <CategoryView title={category} posts={posts} />
}

function CategoryView({ title, posts }: { title: string, posts: any[] }) {
  return (
    <div className="bg-popcorn-dark min-h-screen text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto uppercase tracking-tighter">
      <div className="flex items-center space-x-4 mb-12">
        <h1 className="text-4xl md:text-6xl font-black italic">{title.replace('-', ' ')}</h1>
        <div className="h-0.5 flex-1 bg-white/5" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {posts.map((post, index) => (
          <React.Fragment key={post.id}>
            {post.category === 'movie-blog' || post.category === 'movie-news' ? (
              <BlogCard post={post} />
            ) : (
              <MovieCard movie={post} />
            )}
            
            {/* Insert Ad after every 6 cards */}
            {(index + 1) % 6 === 0 && (
              <div className="col-span-full">
                <AdUnit type="banner" position={`category_${title}_after_${index + 1}`} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

import React from 'react'