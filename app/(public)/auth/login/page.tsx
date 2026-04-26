'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Loader2, FastForward as Google } from 'lucide-react'

import { Suspense } from 'react'

function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'

  const supabase = createClient()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(next)
      router.refresh()
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm bg-popcorn-card rounded-2xl p-10 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-4">
            <Link href="/" className="inline-block hover:scale-105 transition-transform duration-300">
              <span className="text-4xl font-black text-white tracking-tighter shadow-sm">🍿 Popcorn</span>
            </Link>
            <div className="space-y-1 pt-2">
              <h2 className="text-lg font-bold text-white uppercase tracking-tight">Access Dashboard</h2>
              <p className="text-popcorn-secondary text-[10px] font-medium uppercase tracking-[0.2em]">Sign in to continue</p>
            </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-4">
            <div className="relative group">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-popcorn-secondary group-focus-within:text-popcorn-red transition-colors" />
              <input 
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-xs font-bold text-white placeholder:text-neutral-700 focus:outline-none focus:border-popcorn-red/50 transition-all tracking-tight"
              />
            </div>
            <div className="relative group">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-popcorn-secondary group-focus-within:text-popcorn-red transition-colors" />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-12 text-xs font-bold text-white placeholder:text-neutral-700 focus:outline-none focus:border-popcorn-red/50 transition-all tracking-tight"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-popcorn-secondary hover:text-white transition-colors"
              >
                {showPassword ? (
                  <span className="text-[10px] font-black uppercase tracking-tight">Hide</span>
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-tight">Show</span>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-popcorn-red hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center space-x-4">
          <div className="h-px bg-white/5 flex-1" />
          <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Or</span>
          <div className="h-px bg-white/5 flex-1" />
        </div>

        <div className="space-y-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 bg-white/5 border border-white/10 text-white py-4 rounded-xl font-black hover:bg-white hover:text-popcorn-red transition-all shadow-xl group transform active:scale-95 disabled:opacity-50"
          >
             <Google size={18} className="group-hover:scale-110 transition-transform" />
             <span className="text-[10px] tracking-widest uppercase">Google account</span>
          </button>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase font-black tracking-widest p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="text-center">
             <Link 
               href="/"
               className="text-[10px] font-black uppercase tracking-widest text-popcorn-secondary hover:text-white transition-colors"
             >
               Go back to home
             </Link>
          </div>
        </div>
      </div>

  )
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[90vh] px-4 py-12 bg-popcorn-dark">
      <Suspense fallback={<Loader2 className="animate-spin text-popcorn-red" size={32} />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}