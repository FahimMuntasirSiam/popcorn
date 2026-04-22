'use client'

import BlogCard from '@/components/cards/BlogCard'
import { Post } from '@/types'

interface BlogGridProps {
  title: string;
  posts: Post[];
  loading?: boolean;
}

export default function BlogGrid({ title, posts, loading }: BlogGridProps) {
  if (!loading && posts.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between border-l-4 border-popcorn-red pl-4">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
           [...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-popcorn-card animate-pulse rounded-xl" />
          ))
        ) : (
          posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))
        )}
      </div>
    </section>
  )
}
