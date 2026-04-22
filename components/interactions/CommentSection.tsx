'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'
import { MessageSquare, Send, Trash2, Loader2, User as UserIcon } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<any[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const ADMIN_EMAILS = ['admin@popcorn.com', 'owner@popcorn.com'] // Define admins here

  const fetchComments = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Could not load comments')
    } else {
      setComments(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !content.trim()) return

    setSubmitting(true)
    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email?.split('@')[0],
        user_avatar: user.user_metadata?.avatar_url,
        content: content.trim()
      })

    if (error) {
      toast.error('Failed to post comment')
    } else {
      setContent('')
      toast.success('Comment posted!')
      fetchComments()
    }
    setSubmitting(false)
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Delete this comment permanently?')) return

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (error) {
      toast.error('Failed to delete comment')
    } else {
      toast.success('Comment removed')
      fetchComments()
    }
  }

  const isUserAdmin = user && ADMIN_EMAILS.includes(user.email)

  return (
    <div className="space-y-12 py-12 border-t border-white/10">
      <div className="flex items-center space-x-3">
        <div className="bg-popcorn-red/10 p-2 rounded-lg">
          <MessageSquare className="text-popcorn-red" size={24} />
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tight">
          Comments <span className="text-popcorn-red ml-1">{comments.length}</span>
        </h3>
      </div>

      {/* Comment Form */}
      <div className="bg-popcorn-card border border-white/5 rounded-3xl p-1 shadow-2xl relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-popcorn-red/20 to-transparent rounded-[26px] blur opacity-25 group-hover:opacity-50 transition-opacity" />
        <div className="relative bg-[#0d0d0d] rounded-[22px] p-6">
          {user ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-white/10 shrink-0">
                  {user.user_metadata?.avatar_url ? (
                    <Image src={user.user_metadata.avatar_url} alt="You" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                      <UserIcon size={24} className="text-neutral-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Join the discussion... (Press Enter to share)"
                    className="w-full bg-transparent border-none text-white placeholder:text-neutral-700 focus:outline-none min-h-[100px] py-2 resize-none text-lg font-medium"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="bg-popcorn-red text-white flex items-center justify-center space-x-3 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-popcorn-red transition-all transform active:scale-95 disabled:opacity-50 shadow-2xl"
                >
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : <span>Post Comment</span>}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-10 space-y-6">
               <div className="space-y-2">
                 <p className="text-white text-xl font-black uppercase tracking-tight">Login with Google to comment</p>
                 <p className="text-popcorn-secondary text-sm font-medium">Join the community and share your thoughts</p>
               </div>
               <Link 
                href={`/auth/login?next=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '')}`}
                className="inline-flex items-center space-x-3 bg-popcorn-red text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-popcorn-red transition-all shadow-2xl transform hover:-translate-y-1"
               >
                 Sign in with Google
               </Link>
            </div>
          )}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-8">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-white/5 animate-pulse rounded-3xl border border-white/5" />
          ))
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="group relative flex space-x-6 p-8 bg-popcorn-card border border-white/5 rounded-3xl hover:border-popcorn-red/30 transition-all duration-500 shadow-xl">
               <div className="w-14 h-14 rounded-2xl overflow-hidden relative border-2 border-white/10 shrink-0 transform group-hover:rotate-3 transition-transform">
                  {comment.user_avatar ? (
                    <Image src={comment.user_avatar} alt={comment.user_name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                      <UserIcon size={28} className="text-neutral-700" />
                    </div>
                  )}
               </div>
               <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="font-black text-white uppercase tracking-tight text-lg">{comment.user_name}</span>
                        <span className="text-[10px] font-bold text-popcorn-secondary uppercase tracking-[0.2em]">
                          {format(new Date(comment.created_at), 'MMMM dd, yyyy')}
                        </span>
                     </div>
                     {(isUserAdmin || (user && user.id === comment.user_id)) && (
                       <button 
                        onClick={() => handleDelete(comment.id)}
                        className="opacity-0 group-hover:opacity-100 p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-lg"
                        title="Delete comment"
                       >
                         <Trash2 size={18} />
                       </button>
                     )}
                  </div>
                  <p className="text-gray-400 leading-relaxed text-lg font-medium">{comment.content}</p>
               </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white/2 rounded-3xl border-2 border-dashed border-white/10">
             <MessageSquare size={48} className="mx-auto mb-4 text-neutral-800" />
             <p className="text-popcorn-secondary font-black uppercase tracking-widest text-xs">No comments yet</p>
             <p className="text-neutral-700 text-sm mt-1">Be the first to start the discussion!</p>
          </div>
        )}
      </div>
    </div>
  )
}
