'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, User as UserIcon, LogOut, Settings, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { User } from '@supabase/supabase-js'
import { cn } from '@/lib/utils'
import { useLanguages } from '@/components/providers/LanguageProvider'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMoviesOpen, setIsMoviesOpen] = useState(false)
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [lang, setLang] = useState<'EN' | 'BN'>('EN')
  
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const currentLang = searchParams.get('lang') || ''
  const { languages } = useLanguages()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleMouseEnter = () => {
    if (closeTimeout) clearTimeout(closeTimeout)
    setIsMoviesOpen(true)
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsMoviesOpen(false)
    }, 100)
    setCloseTimeout(timeout)
  }

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

  useEffect(() => {
    const getLangFromCookie = () => {
      const cookies = document.cookie.split('; ');
      const transCookie = cookies.find(row => row.startsWith('googtrans='));
      if (transCookie) {
        const value = transCookie.split('=')[1];
        if (value.includes('/en/bn') || value.includes('/en/BN')) return 'BN';
      }
      return 'EN';
    };
    setLang(getLangFromCookie());
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === 'EN' ? 'BN' : 'EN';
    const cookieValue = newLang === 'BN' ? '/en/bn' : '/en/en';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    const expires = new Date();
    expires.setTime(expires.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = `googtrans=${cookieValue}; expires=${expires.toUTCString()}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; expires=${expires.toUTCString()}; path=/; domain=${window.location.hostname};`;
    setLang(newLang);
    window.location.reload();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsProfileOpen(false)
    router.refresh()
  }

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
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="text-popcorn-secondary hover:text-popcorn-red px-3 py-2 rounded-md text-sm font-bold transition-all"
                >
                  Home
                </Link>
                
                <div 
                  className="relative h-16 flex items-center"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href="/movies"
                    className={cn(
                      "text-popcorn-secondary hover:text-popcorn-red px-3 py-2 rounded-md text-sm font-bold transition-all flex items-center space-x-1",
                      isMoviesOpen && "text-popcorn-red"
                    )}
                  >
                    <span>Movies</span>
                    <ChevronDown size={14} className={cn("transition-transform duration-200", isMoviesOpen && "rotate-180")} />
                  </Link>

                  {/* Simplified Text Dropdown */}
                  {isMoviesOpen && (
                    <div className="absolute top-full left-0 w-[180px] bg-[#141414] border border-[#222] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.6)] py-2 animate-in fade-in slide-in-from-top-1 duration-200 z-50">
                       <div className="flex flex-col">
                          <Link 
                            href="/movies"
                            className={cn(
                              "px-4 py-2.5 text-sm transition-all duration-200",
                              currentLang === '' 
                                ? "text-popcorn-red font-bold" 
                                : "text-[#aaa] hover:text-white hover:bg-[#1f1f1f]"
                            )}
                            onClick={() => setIsMoviesOpen(false)}
                          >
                             All Movies
                          </Link>
                          {languages.map((l) => (
                            <Link 
                              key={l.slug}
                              href={`/movies?lang=${l.slug}`}
                              className={cn(
                                "px-4 py-2.5 text-sm transition-all duration-200",
                                currentLang === l.slug 
                                  ? "text-popcorn-red font-bold" 
                                  : "text-[#aaa] hover:text-white hover:bg-[#1f1f1f]"
                              )}
                              onClick={() => setIsMoviesOpen(false)}
                            >
                               {l.flag} {l.name}
                            </Link>
                          ))}
                       </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/blogs"
                  className="text-popcorn-secondary hover:text-popcorn-red px-3 py-2 rounded-md text-sm font-bold transition-all"
                >
                  Blogs
                </Link>
                <Link
                  href="/trailers"
                  className="text-popcorn-secondary hover:text-popcorn-red px-3 py-2 rounded-md text-sm font-bold transition-all"
                >
                  Trailers
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <form onSubmit={handleSearch} className="relative group">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-4 pr-10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-popcorn-red focus:bg-white/10 transition-all w-48 lg:w-64"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-popcorn-secondary group-focus-within:text-popcorn-red transition-colors">
                <Search size={14} />
              </button>
            </form>

            <button
              onClick={toggleLanguage}
              className="px-4 py-1.5 text-[11px] font-black bg-white/5 border border-white/10 rounded-full hover:bg-popcorn-red hover:text-white transition-all tracking-[0.2em] shadow-lg flex items-center space-x-2 group notranslate"
            >
              <span className={lang === 'EN' ? 'text-white' : 'text-white/40'}>EN</span>
              <span className="text-white/20">|</span>
              <span className={lang === 'BN' ? 'text-white' : 'text-white/40'}>বাংলা</span>
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
                        <UserIcon size={16} className="text-white" />
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
                       {user?.email === 'fahimmuntasirsiam@gmail.com' && (
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
            <Link
              href="/"
              className="text-popcorn-secondary hover:text-white block px-3 py-4 rounded-md text-base font-bold border-b border-white/5"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            
            {/* Mobile Movies Section */}
            <div className="border-b border-white/5 py-2">
               <p className="px-3 text-[10px] font-black text-popcorn-secondary uppercase tracking-[0.2em] mb-2">Movies</p>
               <div className="grid grid-cols-2 gap-2 px-3">
                  <Link
                    href="/movies"
                    className={cn(
                      "p-3 rounded-lg text-xs font-bold transition-all",
                      currentLang === '' ? "bg-popcorn-red text-white" : "bg-white/5 text-popcorn-secondary"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    All Movies
                  </Link>
                  {languages.map((l) => (
                    <Link
                      key={l.slug}
                      href={`/movies?lang=${l.slug}`}
                      className={cn(
                        "p-3 rounded-lg text-xs font-bold transition-all",
                        currentLang === l.slug ? "bg-popcorn-red text-white" : "bg-white/5 text-popcorn-secondary"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {l.flag} {l.name}
                    </Link>
                  ))}
               </div>
            </div>

            <Link
              href="/blogs"
              className="text-popcorn-secondary hover:text-white block px-3 py-4 rounded-md text-base font-bold border-b border-white/5"
              onClick={() => setIsOpen(false)}
            >
              Blogs
            </Link>
            <Link
              href="/trailers"
              className="text-popcorn-secondary hover:text-white block px-3 py-4 rounded-md text-base font-bold border-b border-white/5"
              onClick={() => setIsOpen(false)}
            >
              Trailers
            </Link>
            <form onSubmit={handleSearch} className="px-3 py-4 relative">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm text-white focus:outline-none"
              />
              <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 text-popcorn-secondary">
                <Search size={18} />
              </button>
            </form>
            <div className="flex flex-col space-y-4 pt-4 pb-6 border-t border-white/5 mx-3">
               <button
                onClick={toggleLanguage}
                className="text-left py-4 px-3 text-sm font-black text-popcorn-secondary flex items-center justify-between bg-white/5 rounded-xl border border-white/5 active:scale-95 transition-all notranslate"
              >
                <span className="uppercase tracking-widest">Language</span>
                <span className="text-white bg-popcorn-red px-3 py-1 rounded-md">{lang === 'EN' ? 'English' : 'বাংলা'}</span>
              </button>
              {user ? (
                 <div className="space-y-4">
                   <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden relative border border-white/10">
                        {userAvatar ? (
                          <Image src={userAvatar} alt={userDisplayName} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-popcorn-red flex items-center justify-center">
                            <UserIcon size={20} className="text-white" />
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
