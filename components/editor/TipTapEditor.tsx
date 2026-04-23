'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'
import { Languages, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const Tiptap = () => {
  const [isTranslating, setIsTranslating] = useState(false)
  
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '<p>Hello World! 🌎️</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  })

  const handleTranslate = async (targetLang: 'bn' | 'en') => {
    if (!editor) return
    
    const content = editor.getHTML()
    if (!content || content === '<p></p>') return

    setIsTranslating(true)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: content,
          targetLanguage: targetLang
        })
      })

      const data = await res.json()
      if (res.ok && data.translatedText) {
        editor.commands.setContent(data.translatedText)
        toast.success(`Translated to ${targetLang === 'bn' ? 'Bengali' : 'English'}`)
      } else {
        toast.error(data.error || 'Translation failed')
      }
    } catch (err) {
      toast.error('Connection error. Please check your API key.')
    } finally {
      setIsTranslating(false)
    }
  }

  if (!editor) return null

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-popcorn-card/20 min-h-[400px]">
      {/* Toolbar */}
      <div className="bg-white/5 border-b border-white/10 p-2 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('bold') ? 'bg-white/20 text-popcorn-red' : 'text-gray-400'}`}
            title="Bold"
          >
            <b>B</b>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('italic') ? 'bg-white/20 text-popcorn-red' : 'text-gray-400'}`}
            title="Italic"
          >
            <i>I</i>
          </button>
        </div>

        <div className="flex items-center space-x-2 px-2 border-l border-white/10">
          <button
            onClick={() => handleTranslate('bn')}
            disabled={isTranslating}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-popcorn-red/10 text-popcorn-red border border-popcorn-red/20 hover:bg-popcorn-red hover:text-white transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
          >
            {isTranslating ? <Loader2 size={12} className="animate-spin" /> : <Languages size={12} />}
            <span>EN → বাংলা</span>
          </button>
          <button
            onClick={() => handleTranslate('en')}
            disabled={isTranslating}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
          >
            {isTranslating ? <Loader2 size={12} className="animate-spin" /> : <Languages size={12} />}
            <span>বাংলা → EN</span>
          </button>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}

export default Tiptap
