import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { id, title, content, word_count,
            status, slug, meta_description } = body
    
    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Title required' }, 
        { status: 400 }
      )
    }
    
    const postData = {
      title,
      content: content || '',
      word_count: word_count || 0,
      status: status || 'draft',
      slug: slug || title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
      meta_description: meta_description || '',
      updated_at: new Date().toISOString(),
    }
    
    let result
    
    if (id) {
      // Update existing post
      const { data, error } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', id)
        .select('id')
        .single()
      
      if (error) throw error
      result = data
    } else {
      // Insert new draft
      const { data, error } = await supabase
        .from('posts')
        .insert({ ...postData, status: 'draft' })
        .select('id')
        .single()
      
      if (error) throw error
      result = data
    }
    
    // CRITICAL: Never redirect, just return JSON
    return NextResponse.json({ 
      success: true, 
      id: result.id 
    })
    
  } catch (error) {
    console.error('Autosave error:', error)
    return NextResponse.json(
      { error: 'Failed to save' },
      { status: 500 }
    )
  }
}
