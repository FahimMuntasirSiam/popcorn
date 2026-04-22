'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, User, LogOut, Settings } from 'lucide-react'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [lang, setLang] = useState<'EN' | 'BN'>('EN')
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsProfileOpen(false)
    router.refresh()
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Movies', href: '/category/movies' },
    { name: 'Blog', href: '/category/blog' },
    { name: 'Trailers', href: '/category/trailers' },
  ]

  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split('@')[0]
  const userAvatar = user?.user_metadata?.avatar_url

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-black text-white group-hover:scale-110 transition-transform">
                🍿 Popcorn
              </span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-popcorn-secondary hover:text-popcorn-red px-3 py-2 rounded-md text-sm font-bold transition-all"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setLang(lang === 'EN' ? 'BN' : 'EN')}
              className="px-3 py-1 text-[10px] font-black border border-white/20 rounded-md hover:bg-white/10 transition-colors tracking-widest"
            >
              {lang === 'EN' ? 'EN / বাংলা' : 'বাংলা / EN'}
            </button>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 p-1 pr-3 rounded-full transition-all border border-white/5"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden relative border border-white/10">
                    {userAvatar ? (
                      <Image src={userAvatar} alt={userDisplayName} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-popcorn-red flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-bold text-white max-w-[120px] truncate">
                    {userDisplayName}
                  </span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-popcorn-card border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-white/5 bg-white/2">
                       <p className="text-xs font-bold text-popcorn-secondary uppercase tracking-widest">Signed in as</p>
                       <p className="text-sm font-bold text-white truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                       {user?.email?.split('@')[1] === 'gmail.com' && ( // Simple check for admin demo
                         <Link 
                          href="/admin"
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-popcorn-secondary hover:text-white hover:bg-white/5 transition-all"
                         >
                           <Settings size={16} />
                           <span>Admin Dashboard</span>
                         </Link>
                       )}
                       <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-all font-bold"
                       >
                         <LogOut size={16} />
                         <span>Logout</span>
                       </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="bg-popcorn-red text-white px-6 py-2 rounded-xl text-sm font-black hover:bg-neutral-100 hover:text-popcorn-red transition-all shadow-xl"
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-popcorn-dark border-b border-white/10 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-popcorn-secondary hover:text-white block px-3 py-4 rounded-md text-base font-bold"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-4 pt-4 pb-6 border-t border-white/5 mx-3">
               <button
                onClick={() => setLang(lang === 'EN' ? 'BN' : 'EN')}
                className="text-left py-2 text-sm font-bold text-popcorn-secondary"
              >
                Language: {lang === 'EN' ? 'English' : 'বাংলা'}
              </button>
              {user ? (
                 <div className="space-y-4">
                   <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden relative border border-white/10">
                        {userAvatar ? (
                          <Image src={userAvatar} alt={userDisplayName} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-popcorn-red flex items-center justify-center">
                            <User size={20} className="text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-lg font-bold text-white truncate">{userDisplayName}</span>
                   </div>
                   <button
                    onClick={handleLogout}
                    className="w-full bg-white/5 text-red-500 py-3 rounded-xl text-sm font-bold border border-red-500/20"
                  >
                    Log Out
                  </button>
                 </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="bg-popcorn-red text-white py-4 rounded-xl text-lg font-black text-center shadow-2xl"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
