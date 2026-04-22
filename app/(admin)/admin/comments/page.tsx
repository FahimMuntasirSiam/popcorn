'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'
import { 
  MessageSquare, 
  Trash2, 
  User, 
  Calendar, 
  ExternalLink,
  Search
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { AdminComment } from '@/types'

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<AdminComment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchComments = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        posts (
          title,
          slug
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to fetch comments')
    } else {
      setComments(data as AdminComment[] || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this comment?')) return

    const { error } = await supabase.from('comments').delete().eq('id', id)
    
    if (error) {
      toast.error('Error deleting comment')
    } else {
      toast.success('Comment removed')
      fetchComments()
    }
  }

  const filteredComments = comments.filter(c => 
    c.content.toLowerCase().includes(search.toLowerCase()) ||
    c.user_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.posts?.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black">User Comments</h1>
        <p className="text-popcorn-secondary">Moderate the discussion on your blog.</p>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-popcorn-secondary" size={18} />
        <input 
          type="text"
          placeholder="Search comments, users or posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-popcorn-card border border-white/5 rounded-xl py-4 pl-10 pr-4 text-sm focus:outline-none focus:border-popcorn-red transition-all"
        />
      </div>

      <div className="space-y-4">
        {loading ? (
           [...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-popcorn-card animate-pulse rounded-2xl border border-white/5" />
          ))
        ) : filteredComments.map((comment) => (
          <div key={comment.id} className="bg-popcorn-card border border-white/5 rounded-2xl p-6 shadow-xl hover:border-white/10 transition-all flex flex-col md:flex-row gap-6 items-start">
             <div className="flex-1 space-y-4">
                <div className="flex items-center space-x-3 text-xs font-bold uppercase tracking-widest text-popcorn-red">
                   <div className="flex items-center space-x-1">
                      <User size={14} />
                      <span>{comment.user_name || 'Anonymous'}</span>
                   </div>
                   <span className="w-1 h-1 rounded-full bg-neutral-700" />
                   <div className="flex items-center space-x-1 text-popcorn-secondary">
                      <Calendar size={14} />
                      <span>{format(new Date(comment.created_at), 'MMM dd, yyyy')}</span>
                   </div>
                </div>

                <p className="text-white leading-relaxed italic">&quot;{comment.content}&quot;</p>

                <div className="flex items-center space-x-2 text-xs py-2 px-3 bg-white/5 rounded-lg w-fit border border-white/5">
                   <span className="text-popcorn-secondary">On Post:</span>
                   <span className="text-white font-bold max-w-[200px] truncate">{comment.posts?.title}</span>
                   <Link 
                    href={`/movies/${comment.posts?.slug}`}
                    target="_blank"
                    className="text-popcorn-red hover:scale-110 transition-transform"
                   >
                     <ExternalLink size={14} />
                   </Link>
                </div>
             </div>

             <button 
              onClick={() => handleDelete(comment.id)}
              className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all self-end md:self-start border border-red-500/20"
              title="Delete Comment"
             >
               <Trash2 size={20} />
             </button>
          </div>
        ))}

        {!loading && filteredComments.length === 0 && (
          <div className="bg-popcorn-card border border-white/5 rounded-2xl p-12 text-center text-popcorn-secondary italic shadow-xl">
             <MessageSquare size={48} className="mx-auto mb-4 opacity-10" />
             <p>No comments found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}