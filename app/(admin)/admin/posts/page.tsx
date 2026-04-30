'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  ExternalLink,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Post, PostCategory, PostStatus } from '@/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function AllPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<PostCategory | 'all'>('all')
  
  const supabase = createClient()

  const fetchPosts = async () => {
    setLoading(true)
    let query = supabase.from('posts').select('*').order('created_at', { ascending: false })

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }
    if (categoryFilter !== 'all') {
      query = query.eq('category', categoryFilter)
    }
    if (search) {
      query = query.ilike('title', `%${search}%`)
    }

    const { data, error } = await query
    
    if (error) {
      toast.error('Failed to fetch posts')
    } else {
      setPosts(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter, search, supabase])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    const { error } = await supabase.from('posts').delete().eq('id', id)
    
    if (error) {
      toast.error('Error deleting post')
    } else {
      toast.success('Post deleted')
      fetchPosts()
    }
  }

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('posts')
      .update({ is_featured: !currentStatus })
      .eq('id', id)
    
    if (error) {
      toast.error('Failed to update featured status')
    } else {
      toast.success(!currentStatus ? 'Post featured!' : 'Post unfeatured')
      setPosts(posts.map(p => p.id === id ? { ...p, is_featured: !currentStatus } : p))
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">All Posts</h1>
          <p className="text-popcorn-secondary">Manage your movies, news, and trailers.</p>
        </div>
        <Link 
          href="/admin/posts/new"
          className="bg-popcorn-red text-white flex items-center space-x-2 px-6 py-3 rounded-xl font-bold hover:bg-neutral-100 hover:text-popcorn-red transition-all shadow-xl"
        >
          <Plus size={20} />
          <span>New Post</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Content' },
            { id: 'movies', label: 'Movies' },
            { id: 'blogs', label: 'Blogs' },
            { id: 'trailers', label: 'Trailers' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id as any)}
              className={cn(
                "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all border",
                categoryFilter === tab.id 
                  ? "bg-popcorn-red border-popcorn-red text-white shadow-lg shadow-popcorn-red/20" 
                  : "bg-white/5 border-white/10 text-popcorn-secondary hover:text-white hover:bg-white/10"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-popcorn-secondary" size={18} />
            <input 
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-popcorn-card border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-popcorn-red transition-all"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PostStatus | 'all')}
            className="bg-popcorn-card border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-popcorn-red"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-popcorn-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
              <thead className="bg-white/5 text-xs text-popcorn-secondary uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Language</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
                {loading ? (
                   [...Array(8)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-8 h-12 bg-white/1" />
                    </tr>
                  ))
                ) : posts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 max-w-md">
                      <span className="text-sm font-bold text-white line-clamp-1">{post.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] text-popcorn-red font-black uppercase tracking-widest">{post.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-popcorn-secondary uppercase">{post.language_tag}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-black uppercase px-2 py-1 rounded",
                        post.status === 'published' ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"
                      )}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-popcorn-secondary">
                      {format(new Date(post.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => toggleFeatured(post.id, post.is_featured)}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            post.is_featured 
                              ? "bg-popcorn-gold/20 text-popcorn-gold" 
                              : "bg-white/5 text-popcorn-secondary hover:text-popcorn-gold"
                          )}
                          title={post.is_featured ? "Unfeature" : "Feature on Home"}
                        >
                          <Star size={16} fill={post.is_featured ? "currentColor" : "none"} />
                        </button>
                        <Link 
                          target="_blank"
                          href={`/${post.category}/${post.slug}`}
                          className="p-2 text-popcorn-secondary hover:text-blue-500 transition-colors"
                          title="View Live"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <Link 
                          href={`/admin/posts/${post.id}/edit`}
                          className="p-2 bg-white/5 rounded-lg text-popcorn-secondary hover:text-white hover:bg-popcorn-red transition-all"
                        >
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-2 bg-white/5 rounded-lg text-popcorn-secondary hover:text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && posts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center space-y-4">
                       <div className="text-gray-500 text-lg">No posts matching your filters</div>
                       <button 
                        onClick={() => { setSearch(''); setStatusFilter('all'); setCategoryFilter('all'); }}
                        className="text-popcorn-red font-bold uppercase text-xs tracking-widest"
                       >
                         Clear All Filters
                       </button>
                    </td>
                  </tr>
                )}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}