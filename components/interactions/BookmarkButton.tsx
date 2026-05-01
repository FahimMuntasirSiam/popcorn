'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { toast } from 'sonner'
import { User } from '@supabase/supabase-js'

interface BookmarkButtonProps {
  postId: string;
}

export default function BookmarkButton({ postId }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkBookmark = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data, error } = await supabase
          .from('bookmarks')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .maybeSingle()

        if (data) {
          setIsBookmarked(true)
        }
      }
      setLoading(false)
    }

    checkBookmark()
  }, [postId, supabase])

  const toggleBookmark = async () => {
    if (!user) {
      toast.error('Please login to bookmark movies')
      return
    }

    setLoading(true)
    if (isBookmarked) {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id)

      if (error) {
        toast.error('Failed to remove bookmark')
      } else {
        setIsBookmarked(false)
        toast.success('Removed from bookmarks')
      }
    } else {
      const { error } = await supabase
        .from('bookmarks')
        .insert({ post_id: postId, user_id: user.id })

      if (error) {
        toast.error('Failed to add bookmark')
      } else {
        setIsBookmarked(true)
        toast.success('Added to bookmarks')
      }
    }
    setLoading(false)
  }

  if (loading && !user) return <div className="w-12 h-12 bg-white/5 rounded-2xl animate-pulse" />

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`p-4 rounded-2xl border transition-all group flex items-center justify-center ${
        isBookmarked 
          ? 'bg-popcorn-red/10 border-popcorn-red text-popcorn-red shadow-[0_0_20px_-5px_rgba(229,9,20,0.4)]' 
          : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
      }`}
      title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
    >
      {isBookmarked ? (
        <BookmarkCheck size={20} className="fill-popcorn-red animate-in zoom-in duration-300" />
      ) : (
        <Bookmark size={20} className="group-hover:scale-110 transition-transform" />
      )}
    </button>
  )
}
