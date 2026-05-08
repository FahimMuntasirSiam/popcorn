'use client'

import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Link } from '@tiptap/extension-link'
import { Image as ImageExtension } from '@tiptap/extension-image'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Highlight } from '@tiptap/extension-highlight'
import { CharacterCount } from '@tiptap/extension-character-count'
import { Placeholder } from '@tiptap/extension-placeholder'
import TipTapToolbar from './TipTapToolbar'
import EditorErrorBoundary from '../editor/EditorErrorBoundary'
import { useMemo, useRef } from 'react'
import { 
  Save, 
  Upload, 
  Plus, 
  Trash2, 
  Link as LinkIcon, 
  Eye, 
  Settings,
  Loader2,
  ChevronRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { slugify } from '@/lib/slugify'
import { Post, PostCategory, PostStatus, LanguageTag, DownloadLink } from '@/types'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useLanguages } from '@/components/providers/LanguageProvider'

interface EditorPageProps {
  initialData?: Post;
  postId?: string;
}

export default function EditorPage({ initialData, postId }: EditorPageProps) {
  const router = useRouter()
  const supabase = createClient()
  const { languages } = useLanguages()

  // Form State
  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [metaDescription, setMetaDescription] = useState(initialData?.meta_description || '')
  const [category, setCategory] = useState<PostCategory>(initialData?.category || 'movies')
  const [languageTag, setLanguageTag] = useState<LanguageTag>(initialData?.language_tag || 'english')
  const [genre, setGenre] = useState(initialData?.genre || '')
  const [trailerUrl, setTrailerUrl] = useState(initialData?.trailer_url || '')
  const [imdbRating, setImdbRating] = useState(initialData?.imdb_rating?.toString() || '0.0')
  const [status, setStatus] = useState<PostStatus>(initialData?.status || 'draft')
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>(initialData?.download_links || [])
  const [coverImage, setCoverImage] = useState(initialData?.cover_image || '')
  
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Safe command helper
  const safeCommand = (fn: (editor: any) => void) => {
    if (!editor || editor.isDestroyed) return
    fn(editor)
  }

  // TipTap Extensions
  const extensions = useMemo(() => [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      link: false,
      underline: false,
    }),
    Underline,
    Link.configure({ 
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      HTMLAttributes: {
        class: 'text-popcorn-red underline',
        rel: 'noopener noreferrer'
      }
    }).extend({
      addKeyboardShortcuts() {
        return {
          'Mod-k': () => {
            window.dispatchEvent(new CustomEvent('editor-open-link-dialog'))
            return true
          },
          'Mod-Shift-l': () => {
            window.dispatchEvent(new CustomEvent('editor-open-link-dialog'))
            return true
          },
          'Mod-Shift-h': () => {
            this.editor.chain().focus().toggleHighlight().run()
            return true
          },
        }
      },
    }),
    ImageExtension,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    CharacterCount,
    Placeholder.configure({
      placeholder: 'Start writing your post...'
    })
  ], [])

  // TipTap Initialize
  const editor = useEditor({
    immediatelyRender: false,
    autofocus: false,
    extensions,
    content: initialData?.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-red max-w-none focus:outline-none min-h-[500px] p-6 text-white bg-neutral-900/50 rounded-b-xl',
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText()
      setWordCount(text.split(/\s+/).filter(Boolean).length)
    }
  })

  // Auto-slugify
  useEffect(() => {
    if (!postId && !initialData && title) {
       setSlug(slugify(title))
    }
  }, [title, postId, initialData])

  // Word Count Sync on Init
  useEffect(() => {
    if (editor) {
      const text = editor.getText()
      setWordCount(text.split(/\s+/).filter(Boolean).length)
    }
  }, [editor])

  // Save Logic
  const handleSave = async (forceStatus?: PostStatus) => {
    if (!title) {
      toast.error('Title is required')
      return
    }

    const currentStatus = forceStatus || status
    setSaving(true)

    const payload = {
      title,
      slug,
      content: editor?.getHTML() || '',
      meta_description: metaDescription,
      category,
      language_tag: languageTag.toLowerCase(),
      genre: genre.toLowerCase(),
      trailer_url: trailerUrl,
      imdb_rating: parseFloat(imdbRating) || 0,
      status: currentStatus,
      download_links: downloadLinks,
      cover_image: coverImage,
      word_count: wordCount,
      is_featured: isFeatured,
      updated_at: new Date().toISOString()
    }

    let error
    if (postId) {
      const { error: err } = await supabase.from('posts').update(payload).eq('id', postId)
      error = err
    } else {
      const { error: err } = await supabase.from('posts').insert(payload)
      error = err
    }

    if (error) {
      toast.error(error.message)
    } else {
      setStatus(currentStatus) // Sync local status state
      toast.success(postId ? 'Post updated' : 'Post created')
      
      // If published, clear the auto-save interval immediately
      if (currentStatus === 'published' && autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current)
      }

      if (!postId) {
        router.push('/admin/posts')
        router.refresh()
      }
    }
    setSaving(false)
  }

  // Auto-save logic (60s)
  useEffect(() => {
    if (status !== 'draft') return 

    autoSaveIntervalRef.current = setInterval(() => {
      if (!editor || editor.isDestroyed) return
      
      const content = editor.getHTML()
      if (title && content !== '<p></p>') {
        handleSave('draft')
        console.log('Auto-saved draft at', new Date().toLocaleTimeString())
      }
    }, 60000)

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, editor, slug, metaDescription, category, languageTag, genre])

  // Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `covers/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('movie-assets')
      .upload(filePath, file)

    if (uploadError) {
      toast.error('Upload failed: ' + uploadError.message)
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('movie-assets')
        .getPublicUrl(filePath)
      
      setCoverImage(publicUrl)
      toast.success('Image uploaded')
    }
    setUploading(false)
  }

  const addDownloadRow = () => {
    setDownloadLinks([...downloadLinks, { label: '', slug: '', quality: '1080p', size: '', download_url: '' }])
  }

  const updateDownloadRow = (index: number, field: any, value: any) => {
    const newLinks = [...downloadLinks]
    const updatedLink = { ...newLinks[index] }
    
    // @ts-ignore
    updatedLink[field] = value
    
    // Auto-generate slug from post slug + quality
    if (field === 'quality' || field === 'label') {
      updatedLink.slug = `${slug}-${updatedLink.quality || 'hd'}`
    }
    
    newLinks[index] = updatedLink
    setDownloadLinks(newLinks)
  }

  const removeDownloadRow = (index: number) => {
    setDownloadLinks(downloadLinks.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full max-w-[1600px] mx-auto pb-20">
      {/* LEFT PANEL - The Editor (70%) */}
      <div className="lg:w-[70%] space-y-6">
        <div className="bg-popcorn-card border border-white/5 rounded-2xl p-8 shadow-2xl space-y-8">
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter movie title..."
            className="w-full bg-transparent border-none text-4xl md:text-6xl font-black text-white focus:outline-none placeholder:text-neutral-800 transition-all"
          />
          
          <div className="border border-white/10 rounded-2xl overflow-hidden shadow-inner bg-neutral-900/30">
            <TipTapToolbar editor={editor} />
            <div className="min-h-[400px] transition-all duration-300">
              <EditorErrorBoundary onReset={() => router.refresh()}>
                <EditorContent editor={editor} />
              </EditorErrorBoundary>
            </div>
            <div className="p-4 bg-white/5 border-t border-white/10 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-popcorn-secondary">
               <div className="flex items-center space-x-2">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span>Editor Ready</span>
               </div>
               <span>Words: {wordCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Settings (30%) */}
      <aside className="lg:w-[30%] space-y-6">
        {/* Cover Image Section */}
        <section className="bg-popcorn-card border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
           <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center text-popcorn-red">
             <Settings size={16} className="mr-2" />
             Post Settings
           </h3>
           
           <div className="space-y-3">
             <label className="text-xs font-bold text-popcorn-secondary uppercase tracking-wider">Cover Image</label>
             <div className="relative group min-h-[200px] bg-black/40 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-popcorn-red group">
               {coverImage ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <img src={coverImage} alt="Cover" className="max-w-full max-h-[500px] object-contain transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                       <label className="cursor-pointer bg-white text-black text-[10px] font-black px-6 py-3 rounded-full uppercase tracking-widest hover:scale-110 transition-transform">
                         Change Cover
                         <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                       </label>
                    </div>
                  </div>
               ) : (
                  <label className="cursor-pointer flex flex-col items-center text-popcorn-secondary hover:text-white transition-all hover:scale-110">
                    <Upload size={32} className="mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Upload Header</span>
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
               )}
               {uploading && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
                    <div className="flex flex-col items-center space-y-2">
                      <Loader2 className="animate-spin text-popcorn-red" size={32} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">Uploading...</span>
                    </div>
                  </div>
               )}
             </div>
           </div>

           <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-popcorn-secondary uppercase tracking-wider text-[10px]">Manual Slug</label>
                <div className="flex bg-black/50 border border-white/10 rounded-lg p-3 group focus-within:border-popcorn-red transition-all">
                   <LinkIcon size={14} className="text-neutral-600 mr-2 mt-0.5 group-focus-within:text-popcorn-red" />
                   <input 
                    type="text" 
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="bg-transparent border-none text-xs text-white focus:outline-none w-full font-mono" 
                   />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-end">
                   <label className="text-xs font-bold text-popcorn-secondary uppercase tracking-wider text-[10px]">Meta Description</label>
                   <span className={cn("text-[10px] font-bold", metaDescription.length > 160 ? "text-red-500" : "text-popcorn-secondary")}>
                     {metaDescription.length}/160
                   </span>
                </div>
                <textarea 
                  rows={4}
                  maxLength={165}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className={cn(
                    "w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none transition-all",
                    metaDescription.length > 160 ? "border-red-500/50" : "focus:border-popcorn-red"
                  )}
                  placeholder="The summary that appears in Google..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-popcorn-secondary uppercase tracking-wider text-[10px]">Category</label>
                   <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PostCategory)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-popcorn-red"
                   >
                      <option value="movies">Movies</option>
                      <option value="web-series">Web Series 📺</option>
                      <option value="blogs">Blogs</option>
                      <option value="trailers">Trailers</option>
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-popcorn-secondary uppercase tracking-wider text-[10px]">Language</label>
                   <select 
                    value={languageTag}
                    onChange={(e) => setLanguageTag(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-popcorn-red"
                   >
                     <option value="">Select Language</option>
                     {languages.map(lang => (
                       <option key={lang.slug} value={lang.slug}>
                         {lang.flag} {lang.name}
                       </option>
                     ))}
                   </select>
                 </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-popcorn-secondary uppercase tracking-wider text-[10px]">Genre</label>
                <input 
                  list="genres"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  placeholder="e.g. Action, Horror, Comedy..."
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-popcorn-red"
                />
                <datalist id="genres">
                  <option value="action" />
                  <option value="horror" />
                  <option value="comedy" />
                  <option value="drama" />
                  <option value="sci-fi" />
                </datalist>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="bg-[#F5C518] text-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase leading-none">IMDb</span>
                  <label className="text-xs font-bold text-popcorn-secondary uppercase tracking-wider text-[10px]">IMDb Rating</label>
                </div>
                <input 
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={imdbRating}
                  onChange={(e) => setImdbRating(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-popcorn-red"
                  placeholder="e.g. 8.5"
                />
                <p className="text-[9px] text-neutral-600 italic mt-1 px-1">Out of 10 — from IMDb</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-popcorn-secondary uppercase tracking-wider text-[10px]">YouTube Trailer URL</label>
                <input 
                  type="url"
                  value={trailerUrl}
                  onChange={(e) => setTrailerUrl(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-popcorn-red"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
           </div>
        </section>

        {/* Download Links Section */}
        <section className="bg-popcorn-card border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
           <div className="flex items-center justify-between">
             <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Download Links</h3>
             <button 
              onClick={addDownloadRow} 
              className="p-1.5 bg-popcorn-red/10 text-popcorn-red hover:bg-popcorn-red hover:text-white rounded-lg transition-all"
              title="Add Link Row"
             >
                <Plus size={18} />
             </button>
           </div>
           
           <div className="space-y-3">
              {downloadLinks.map((link, i) => (
                <div key={i} className="flex gap-2 p-4 bg-black/50 rounded-xl border border-white/5 relative group animate-in fade-in slide-in-from-top-1">
                   <div className="flex flex-col gap-3 w-full">
                        <div className="grid grid-cols-2 gap-3">
                           <div className="space-y-1">
                             <label className="text-[10px] uppercase font-black text-neutral-600">Label</label>
                             <input 
                               placeholder="e.g. 1080p MEGA"
                               value={link.label}
                               onChange={(e) => updateDownloadRow(i, 'label', e.target.value)}
                               className="w-full bg-transparent border-b border-white/5 text-xs font-bold text-white focus:outline-none focus:border-popcorn-red py-1"
                             />
                           </div>
                           <div className="space-y-1">
                             <label className="text-[10px] uppercase font-black text-neutral-600">Quality</label>
                             <select 
                               value={link.quality}
                               onChange={(e) => updateDownloadRow(i, 'quality', e.target.value)}
                               className="w-full bg-transparent border-b border-white/5 text-xs font-bold text-white focus:outline-none focus:border-popcorn-red py-1"
                             >
                               <option value="2160p">2160p</option>
                               <option value="1080p">1080p</option>
                               <option value="720p">720p</option>
                               <option value="480p">480p</option>
                               <option value="360p">360p</option>
                             </select>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           <div className="space-y-1">
                             <label className="text-[10px] uppercase font-black text-neutral-600">File Size</label>
                             <input 
                               placeholder="e.g. 2.1 GB"
                               value={link.size || ''}
                               onChange={(e) => updateDownloadRow(i, 'size', e.target.value)}
                               className="w-full bg-transparent border-b border-white/5 text-xs font-bold text-white focus:outline-none focus:border-popcorn-red py-1"
                             />
                           </div>
                           <div className="space-y-1">
                             <label className="text-[10px] uppercase font-black text-neutral-600">Download URL</label>
                             <input 
                               placeholder="Paste any download link (MEGA, Telegram, Google Drive...)"
                               value={link.download_url || ''}
                               onChange={(e) => updateDownloadRow(i, 'download_url', e.target.value)}
                               className="w-full bg-transparent border-b border-white/5 text-xs font-bold text-white focus:outline-none focus:border-popcorn-red py-1"
                             />
                             <p className="text-[8px] text-neutral-600 italic mt-1">Supports MEGA, Telegram, Google Drive or any direct link</p>
                           </div>
                        </div>
                   </div>
                   <button 
                    onClick={() => removeDownloadRow(i)}
                    className="absolute top-2 right-2 p-1.5 text-neutral-700 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                   >
                     <Trash2 size={14} />
                   </button>
                </div>
              ))}
              {downloadLinks.length === 0 && (
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-2 border-2 border-dashed border-white/5 rounded-xl">
                  <Plus size={24} className="text-neutral-800" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-700">No links added yet</p>
                </div>
              )}
           </div>
        </section>

        {/* Publish Actions */}
        <section className="bg-popcorn-card border border-white/5 rounded-2xl p-6 shadow-xl space-y-4 sticky top-6">
           <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-popcorn-secondary uppercase tracking-widest">Post Visibility</span>
              <button 
                onClick={() => setStatus(status === 'published' ? 'draft' : 'published')}
                className={cn(
                  "text-[10px] font-black px-6 py-2 rounded-full border transition-all uppercase tracking-[0.2em]",
                  status === 'published' ? "bg-green-500/10 border-green-500 text-green-500 shadow-[0_0_15px_-5px_rgba(34,197,94,0.4)]" : "bg-yellow-500/10 border-yellow-500 text-yellow-500"
                )}
              >
                {status}
              </button>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <button 
                disabled={saving}
                onClick={() => handleSave('draft')}
                className="flex items-center justify-center space-x-2 py-4 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-popcorn-secondary disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                <span>Save Draft</span>
              </button>
              <button 
                disabled={saving}
                onClick={() => handleSave('published')}
                className="flex items-center justify-center space-x-2 py-4 rounded-xl bg-popcorn-red text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-100 hover:text-popcorn-red transition-all shadow-xl disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
                <span>Publish</span>
              </button>
           </div>

           <button className="w-full flex items-center justify-center space-x-2 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-popcorn-secondary hover:text-white transition-all group">
              <Eye size={14} className="group-hover:scale-110 transition-transform" />
              <span>Preview Link</span>
           </button>
        </section>
      </aside>
    </div>
  )
}
