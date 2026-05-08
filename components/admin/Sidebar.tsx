'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Image as ImageIcon, 
  PlusCircle,
  Home,
  LogOut,
  Globe
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'All Posts', href: '/admin/posts', icon: FileText },
    { name: 'Comments', href: '/admin/comments', icon: MessageSquare },
    { name: 'Languages', href: '/admin/languages', icon: Globe },
    { name: 'Media', href: '/admin/media', icon: ImageIcon },
  ]

  return (
    <aside className="w-64 bg-popcorn-card border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-black text-white">🍿 Popcorn</span>
          <span className="bg-popcorn-red text-[10px] text-white px-2 py-0.5 rounded font-bold uppercase tracking-tighter">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                isActive 
                  ? "bg-popcorn-red text-white shadow-lg" 
                  : "text-popcorn-secondary hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          )
        })}
        
        <div className="pt-8 pb-4">
           <Link
              href="/admin/posts/new"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-black bg-white text-black hover:bg-neutral-200 transition-all shadow-xl"
            >
              <PlusCircle size={20} />
              <span>Write New Post</span>
            </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <Link 
          href="/"
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-popcorn-secondary hover:text-white transition-all w-full"
        >
          <Home size={20} />
          <span>View Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
