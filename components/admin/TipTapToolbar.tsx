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
  Highlighter
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { translateText } from '@/lib/translate'

interface ToolbarProps {
  editor: Editor | null;
}

export default function TipTapToolbar({ editor }: ToolbarProps) {
  const [translating, setTranslating] = useState(false)

  if (!editor) return null

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
    const url = window.prompt('Image URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setLink = () => {
    const url = window.prompt('Link URL')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
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

      {/* [Text Color] [Highlight] */}
      <div className="flex items-center gap-1">
        <input
          type="color"
          onInput={(event) => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#ffffff'}
          className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0 overflow-hidden"
          title="Text Color"
        />
        <Button 
          onClick={() => editor.chain().focus().toggleHighlight().run()} 
          isActive={editor.isActive('highlight')} 
          title="Highlight"
        >
          <Highlighter size={18} />
        </Button>
      </div>

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
    </div>
  )
}
