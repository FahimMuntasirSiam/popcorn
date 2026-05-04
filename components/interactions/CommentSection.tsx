'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
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

  const supabase = createClient()

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
    <div className="space-y-12">
      {/* Comment Form */}
      <div className="relative">
        {user ? (
          <form onSubmit={handleSubmit} className="bg-[#141414] border border-[#222] rounded-xl p-6 space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full overflow-hidden relative border border-white/10 shrink-0">
                {user.user_metadata?.avatar_url ? (
                  <Image src={user.user_metadata.avatar_url} alt="You" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                    <UserIcon size={20} className="text-neutral-500" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What are your thoughts?"
                  className="w-full bg-transparent border-none text-white placeholder:text-neutral-600 focus:outline-none min-h-[80px] py-2 resize-none text-[15px]"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-[#1f1f1f]">
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="bg-popcorn-red text-white flex items-center justify-center space-x-2 px-6 py-2 rounded-lg font-bold uppercase tracking-widest text-[11px] hover:bg-white hover:text-popcorn-red transition-all transform active:scale-95 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="animate-spin" size={14} /> : <span>Post Comment</span>}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-[#141414] border border-[#222] rounded-xl p-8 text-center">
             <div className="max-w-[320px] mx-auto space-y-2 mb-6">
               <h4 className="text-white text-[16px] font-[600]">Sign in to join the discussion</h4>
               <p className="text-[#666] text-[13px]">Login with Google to share your thoughts with the community</p>
             </div>
             <Link 
              href={`/auth/login?next=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '')}`}
              className="inline-flex items-center space-x-3 bg-popcorn-red text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-[11px] hover:bg-white hover:text-popcorn-red transition-all shadow-xl"
             >
               Sign in with Google
             </Link>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          [...Array(2)].map((_, i) => (
            <div key={i} className="h-24 bg-white/5 animate-pulse rounded-xl" />
          ))
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="group relative flex space-x-4 p-5 bg-[#141414] border border-[#1f1f1f] rounded-xl transition-all">
               <div className="w-10 h-10 rounded-full overflow-hidden relative border border-white/10 shrink-0">
                  {comment.user_avatar ? (
                    <Image src={comment.user_avatar} alt={comment.user_name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                      <UserIcon size={20} className="text-neutral-700" />
                    </div>
                  )}
               </div>
               <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <span className="font-bold text-white text-[14px]">{comment.user_name}</span>
                        <span className="text-[11px] font-medium text-[#666]">
                          {format(new Date(comment.created_at), 'MMM dd, yyyy')}
                        </span>
                     </div>
                     {(isUserAdmin || (user && user.id === comment.user_id)) && (
                       <button 
                        onClick={() => handleDelete(comment.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-[#666] hover:text-popcorn-red transition-all"
                        title="Delete comment"
                       >
                         <Trash2 size={14} />
                       </button>
                     )}
                  </div>
                  <p className="text-[#d1d1d1] leading-relaxed text-[15px]">{comment.content}</p>
               </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
             <div className="text-[32px] mb-3">💬</div>
             <p className="text-white text-[15px] font-[500] mb-1">No comments yet</p>
             <p className="text-[#666] text-[13px]">Be the first to start the discussion!</p>
          </div>
        )}
      </div>
    </div>
  )
}
