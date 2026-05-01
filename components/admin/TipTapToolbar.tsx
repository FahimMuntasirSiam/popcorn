'use client'

import { type Editor } from '@tiptap/react'
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Heading1,
  Heading2, 
  Heading3, 
  Languages, 
  Image as ImageIcon,
  Link as LinkIcon,
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo,
  Loader2,
  Type,
  Highlighter,
  Trash2,
  HelpCircle,
  Link2Off,
  Eraser
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { translateText } from '@/lib/translate'

interface ToolbarProps {
  editor: Editor | null;
}

export default function TipTapToolbar({ editor }: ToolbarProps) {
  const [translating, setTranslating] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const colorInputRef = useRef<HTMLInputElement>(null)
  const highlightInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = () => {
      if (!editor || editor.isDestroyed) return
      setLink()
    }
    window.addEventListener('editor-open-link-dialog', handler)
    return () => window.removeEventListener('editor-open-link-dialog', handler)
  }, [editor])

  if (!editor) return null

  const isDestroyed = editor.isDestroyed

  const handleTranslate = async (lang: 'bn' | 'en') => {
    const content = editor.getHTML()
    if (!content || content === '<p></p>') {
       toast.error('Editor is empty')
       return
    }

    setTranslating(true)
    try {
       const translated = await translateText(content, lang)
       editor.commands.setContent(translated)
       toast.success(`Translated to ${lang === 'bn' ? 'Bengali' : 'English'}`)
    } catch (err: unknown) {
       const message = err instanceof Error ? err.message : 'Translation failed'
       toast.error(message)
    } finally {
       setTranslating(false)
    }
  }

  const addImage = () => {
    if (!editor || editor.isDestroyed) return
    const url = window.prompt('Image URL')
    if (url) {
      try {
        editor.chain().focus().setImage({ src: url }).run()
      } catch (err) {
        toast.error('Failed to insert image')
      }
    }
  }

  const setLink = () => {
    if (!editor || editor.isDestroyed) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Link URL', previousUrl)
    
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const applyColor = (color: string) => {
    if (!editor || editor.isDestroyed) return
    editor.chain().focus().setColor(color).run()
  }

  const applyHighlight = (color: string) => {
    if (!editor || editor.isDestroyed) return
    editor.chain().focus().setHighlight({ color }).run()
  }

  const Button = ({ onClick, isActive, children, title, className }: { onClick: () => void, isActive?: boolean, children: React.ReactNode, title: string, className?: string }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-md transition-colors ${
        isActive ? 'bg-popcorn-red text-white' : 'text-popcorn-secondary hover:bg-white/5 hover:text-white'
      } ${className}`}
    >
      {children}
    </button>
  )

  const Separator = () => <div className="w-px h-6 bg-white/10 mx-1" />

  return (
    <div className="bg-popcorn-card border border-white/5 p-2 rounded-t-xl flex flex-wrap items-center gap-1 sticky top-0 z-20 backdrop-blur-sm bg-opacity-90">
      {/* [H1] [H2] [H3] */}
      <Button 
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </Button>
      <Button 
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </Button>
      <Button 
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        <Heading3 size={18} />
      </Button>
      
      <Separator />

      {/* [B] [I] [U] [S] */}
      <Button onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
        <Bold size={18} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
        <Italic size={18} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
        <Underline size={18} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strike">
        <Strikethrough size={18} />
      </Button>

      <Separator />

      {/* [Text Color] [Highlight] [Unset Color] */}
      <div className="flex items-center gap-1">
        <div className="relative flex items-center gap-1 bg-white/5 p-1 rounded-lg">
          <button
            className="w-7 h-7 rounded border border-white/20 transition-all hover:scale-105"
            style={{ 
              backgroundColor: editor.getAttributes('textStyle').color || '#ffffff',
            }}
            onClick={() => colorInputRef.current?.click()}
            title="Text Color"
          />
          <input
            ref={colorInputRef}
            type="color"
            value={editor.getAttributes('textStyle').color || '#ffffff'}
            onChange={(e) => applyColor(e.target.value)}
            className="absolute opacity-0 w-0 h-0 pointer-events-none"
          />
          <button 
            onClick={() => editor.chain().focus().unsetColor().run()}
            className="text-[10px] text-neutral-500 hover:text-white px-1"
            title="Unset Color"
          >
            ✕
          </button>
        </div>

        <div className="relative flex items-center gap-1 bg-white/5 p-1 rounded-lg">
          <button
            className="w-7 h-7 rounded border border-white/20 transition-all hover:scale-105 flex items-center justify-center"
            style={{ 
              backgroundColor: editor.getAttributes('highlight').color || 'transparent',
            }}
            onClick={() => highlightInputRef.current?.click()}
            title="Highlight Color"
          >
            <Highlighter size={14} className={editor.isActive('highlight') ? 'text-white' : 'text-neutral-500'} />
          </button>
          <input
            ref={highlightInputRef}
            type="color"
            value={editor.getAttributes('highlight').color || '#ffff00'}
            onChange={(e) => applyHighlight(e.target.value)}
            className="absolute opacity-0 w-0 h-0 pointer-events-none"
          />
          <button 
            onClick={() => editor.chain().focus().unsetHighlight().run()}
            className="text-[10px] text-neutral-500 hover:text-white px-1"
            title="Unset Highlight"
          >
            ✕
          </button>
        </div>
      </div>

      <Separator />

      {/* [Clear Formatting] */}
      <Button 
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} 
        title="Clear Formatting"
      >
        <Eraser size={18} />
      </Button>

      <Separator />

      {/* [Link] [Image] */}
      <Button onClick={setLink} isActive={editor.isActive('link')} title="Link">
        <LinkIcon size={18} />
      </Button>
      <Button onClick={addImage} title="Insert Image">
        <ImageIcon size={18} />
      </Button>

      <Separator />

      {/* [• List] [1. List] */}
      <Button onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
        <List size={18} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
        <ListOrdered size={18} />
      </Button>

      <Separator />

      {/* [Quote] */}
      <Button onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Blockquote">
        <Quote size={18} />
      </Button>

      <Separator />

      {/* [Undo] [Redo] */}
      <Button onClick={() => editor.chain().focus().undo().run()} title="Undo">
        <Undo size={18} />
      </Button>
      <Button onClick={() => editor.chain().focus().redo().run()} title="Redo">
        <Redo size={18} />
      </Button>

      <Separator />

      {/* [EN→বাংলা] [বাংলা→EN] */}
      <div className="flex bg-neutral-900 rounded-lg p-1 space-x-1 ml-auto">
        <button
          onClick={() => handleTranslate('bn')}
          disabled={translating}
          className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors flex items-center hover:bg-popcorn-red/20 rounded"
        >
          {translating ? <Loader2 size={12} className="animate-spin mr-1" /> : <Languages size={12} className="mr-1" />}
          EN → বাংলা
        </button>
        <div className="w-px h-3 bg-white/10 my-auto" />
        <button
          onClick={() => handleTranslate('en')}
          disabled={translating}
          className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors flex items-center hover:bg-popcorn-red/20 rounded"
        >
           {translating ? <Loader2 size={12} className="animate-spin mr-1" /> : <Languages size={12} className="mr-1" />}
          বাংলা → EN
        </button>
      </div>

      <Separator />

      {/* Help Tooltip */}
      <div className="relative">
        <Button onClick={() => setShowShortcuts(!showShortcuts)} title="Keyboard Shortcuts">
          <HelpCircle size={18} />
        </Button>
        
        {showShortcuts && (
          <div className="absolute right-0 bottom-full mb-2 w-64 bg-neutral-900 border border-white/10 rounded-xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-popcorn-red mb-3">Keyboard Shortcuts</h4>
            <div className="space-y-2">
              {[
                ['Ctrl+B', 'Bold'],
                ['Ctrl+I', 'Italic'],
                ['Ctrl+U', 'Underline'],
                ['Ctrl+K', 'Insert Link'],
                ['Ctrl+Shift+H', 'Highlight'],
                ['Ctrl+Shift+L', 'Insert Link'],
                ['Ctrl+Z', 'Undo'],
                ['Ctrl+Shift+Z', 'Redo'],
              ].map(([key, label]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-[10px] text-neutral-400 font-bold">{label}</span>
                  <kbd className="px-2 py-0.5 bg-white/5 rounded border border-white/10 text-[9px] font-mono text-white">{key}</kbd>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowShortcuts(false)}
              className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
