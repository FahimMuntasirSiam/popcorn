'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'
import { Star, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReviewSectionProps {
  postId: string;
}

export default function ReviewSection({ postId }: ReviewSectionProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [average, setAverage] = useState(0)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)

    // Fetch Avg & Count
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('post_id', postId)

    if (reviews && reviews.length > 0) {
      const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      setAverage(avg)
      setCount(reviews.length)
      
      // Update the post cache (optional but good practice)
      // await supabase.from('posts').update({ avg_rating: avg, total_reviews: reviews.length }).eq('id', postId)
    } else {
      setAverage(0)
      setCount(0)
    }

    // Fetch User Rating
    if (user) {
      const { data: userReview, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (userReview) {
        setRating(userReview.rating)
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, supabase])

  const handleRate = async (value: number) => {
    if (!user) return
    setSubmitting(true)

    const { error } = await supabase
      .from('reviews')
      .upsert({
        post_id: postId,
        user_id: user.id,
        rating: value,
      }, { onConflict: 'post_id,user_id' })

    if (error) {
       toast.error('Failed to submit rating')
    } else {
       setRating(value)
       toast.success('Rating updated!')
       await fetchData()
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-3 bg-white/5 px-6 py-3 rounded-2xl animate-pulse w-fit">
        <div className="flex space-x-1">
          {[1,2,3,4,5].map(i => <div key={i} className="w-5 h-5 bg-neutral-800 rounded-full" />)}
        </div>
        <div className="h-4 w-20 bg-neutral-800 rounded" />
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-6 bg-popcorn-card/40 border border-white/5 p-4 pr-8 rounded-[2rem] shadow-2xl backdrop-blur-xl w-fit group">
        <div className="flex items-center space-x-1 bg-black/40 p-2 rounded-2xl border border-white/5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              disabled={!user || submitting}
              onMouseEnter={() => user && setHoverRating(star)}
              onMouseLeave={() => user && setHoverRating(null)}
              onClick={() => handleRate(star)}
              className={cn(
                "transition-all duration-300",
                user ? "hover:scale-125 cursor-pointer" : "cursor-default active:scale-95"
              )}
            >
              <Star
                size={24}
                className={cn(
                  "transition-all duration-300",
                  (hoverRating || rating || 0) >= star
                    ? "fill-popcorn-gold text-popcorn-gold drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]"
                    : "text-neutral-800 fill-none"
                )}
              />
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
           <div className="h-10 w-px bg-white/10" />
           <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-white italic">{average.toFixed(1)}</span>
                <Star size={16} className="fill-popcorn-gold text-popcorn-gold mb-1" />
              </div>
              <span className="text-[10px] font-black text-popcorn-secondary uppercase tracking-[0.2em] whitespace-nowrap">
                {count} {count === 1 ? 'Rating' : 'Ratings'}
              </span>
           </div>
        </div>
      </div>

      {!user ? (
        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-popcorn-secondary pl-4">
          <span className="w-1 h-1 bg-popcorn-red rounded-full" />
          <span>Login with Google to rate this movie</span>
        </div>
      ) : rating ? (
        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-green-500 pl-4 animate-in slide-in-from-left duration-500">
           <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
           <span>You rated this movie {rating}/5 stars</span>
        </div>
      ) : null}
    </div>
  )
}
