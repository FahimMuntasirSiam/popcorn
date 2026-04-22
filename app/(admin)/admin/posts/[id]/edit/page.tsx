import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import EditorPage from '@/components/admin/EditorPage'

export default async function EditPostPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const supabase = createClient()
  
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-sm font-black uppercase tracking-[0.3em] text-popcorn-red mb-2">Editor Suite</h1>
        <div className="flex items-center space-x-2">
          <h2 className="text-3xl font-black italic">Editing: {post.title}</h2>
          <span className="w-1.5 h-1.5 rounded-full bg-popcorn-red animate-pulse" />
          <span className="text-xs font-bold text-popcorn-secondary uppercase tracking-widest">Live Mode</span>
        </div>
      </header>
      
      <EditorPage initialData={post} postId={post.id} />
    </div>
  )
}