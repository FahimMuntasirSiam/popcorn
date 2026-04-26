'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  MessageSquare,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Post } from '@/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    comments: 0
  })
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  async function fetchDashboardData() {
    setLoading(true)
    
    // Fetch stats
    const [
      { count: totalCount },
      { count: publishedCount },
      { count: commentsCount }
    ] = await Promise.all([
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('comments').select('*', { count: 'exact', head: true })
    ])

    setStats({
      total: totalCount || 0,
      published: publishedCount || 0,
      drafts: (totalCount || 0) - (publishedCount || 0),
      comments: commentsCount || 0
    })

    // Fetch recent posts
    const { data: posts } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    setRecentPosts(posts || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [supabase])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    const { error } = await supabase.from('posts').delete().eq('id', id)
    
    if (error) {
      toast.error('Error deleting post')
    } else {
      toast.success('Post deleted successfully')
      fetchDashboardData()
    }
  }

  const statCards = [
    { name: 'Total Posts', value: stats.total, icon: FileText, color: 'text-blue-500' },
    { name: 'Published', value: stats.published, icon: CheckCircle, color: 'text-green-500' },
    { name: 'Drafts', value: stats.drafts, icon: Clock, color: 'text-yellow-500' },
    { name: 'Comments', value: stats.comments, icon: MessageSquare, color: 'text-popcorn-red' },
  ]

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Dashboard</h1>
          <p className="text-popcorn-secondary">Welcome back. Here&apos;s what&apos;s happening with Popcorn.</p>
        </div>
        <Link 
          href="/admin/posts/new"
          className="bg-popcorn-red text-white flex items-center space-x-2 px-6 py-3 rounded-xl font-bold hover:bg-neutral-100 hover:text-popcorn-red transition-all shadow-xl group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          <span>New Movie / Post</span>
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.name} className="bg-popcorn-card border border-white/5 p-6 rounded-2xl shadow-lg flex items-center space-x-4">
             <div className="bg-white/5 p-4 rounded-xl">
               <card.icon className={card.color} size={24} />
             </div>
             <div>
                <p className="text-xs font-bold text-popcorn-secondary uppercase tracking-widest">{card.name}</p>
                <p className="text-2xl font-black text-white">{card.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <section className="bg-popcorn-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Posts</h2>
          <Link href="/admin/posts" className="text-xs font-bold text-popcorn-red uppercase tracking-widest hover:underline">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-white/5 text-xs text-popcorn-secondary uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
                {loading ? (
                   [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-6 py-8 h-12 bg-white/2" />
                    </tr>
                  ))
                ) : recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white line-clamp-1">{post.title}</span>
                        <span className="text-xs text-popcorn-secondary uppercase">{post.category}</span>
                      </div>
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
                {!loading && recentPosts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-popcorn-secondary italic">No posts found. Start writing!</td>
                  </tr>
                )}
             </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}