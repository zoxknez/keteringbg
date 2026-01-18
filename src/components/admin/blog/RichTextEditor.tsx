'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon
} from 'lucide-react'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder = 'Počnite pisati...' }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-amber-500 hover:text-amber-400 underline',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    if (!editor) {
        return null
    }

    const addImage = () => {
        const url = window.prompt('URL slike:')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL:', previousUrl)

        if (url === null) {
            return
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    return (
        <div className="border border-neutral-800 rounded-lg bg-neutral-900 overflow-hidden">
            {/* Toolbar */}
            <div className="border-b border-neutral-800 p-2 flex flex-wrap gap-1 bg-neutral-800/50">
                {/* Text Formatting */}
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-neutral-700 transition-colors ${editor.isActive('bold') ? 'bg-amber-500/20 text-amber-500' : 'text-neutral-400'
                        }`}
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-neutral-700 transition-colors ${editor.isActive('italic') ? 'bg-amber-500/20 text-amber-500' : 'text-neutral-400'
                        }`}
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={`p-2 rounded hover:bg-neutral-700 transition-colors ${editor.isActive('strike') ? 'bg-amber-500/20 text-amber-500' : 'text-neutral-400'
                        }`}
                    title="Strikethrough"
                >
                    <Strikethrough className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={!editor.can().chain().focus().toggleCode().run()}
                    className={`p-2 rounded hover:bg-neutral-700 transition-colors ${editor.isActive('code') ? 'bg-amber-500/20 text-amber-500' : 'text-neutral-400'
                        }`}
                    title="Inline Code"
                >
                    <Code className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-neutral-700 mx-1" />

                {/* Headings */}
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded hover:bg-neutral-700 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-amber-500/20 text-amber-500' : 'text-neutral-400'
                        }`}
                    title="Heading 1"
                >
                    <Heading1 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-neutral-700 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-amber-500/20 text-amber-500' : 'text-neutral-400'
                        }`}
                    title="Heading 2"
                >
                    <Heading2 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-2 rounded hover:bg-neutral-700 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-amber-500/20 text-amber-500' : 'text-neutral-400'
                        }`}
                    title="Heading 3"
                >
                    <Heading3 className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-neutral-700 mx-1" />

                {/* Lists */}
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-neutral-700 transition-colors ${editor.isActive('bulletList') ? 'bg-amber-500/20 text-amber-500' : 'text-neutral-400'
                        }`}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-neutral-700 transition-colors ${editor.isActive('orderedList') ? 'bg-amber-500/20 text-amber-500' : 'text-neutral-400'
                        }`}
                    title="Numbered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-neutral-700 transition-colors ${editor.isActive('blockquote') ? 'bg-amber-500/20 text-amber-500' : 'text-neutral-400'
                        }`}
                    title="Blockquote"
                >
                    <Quote className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-neutral-700 mx-1" />

                {/* Media & Links */}
                <button
                    onClick={setLink}
                    className={`p-2 rounded hover:bg-neutral-700 transition-colors ${editor.isActive('link') ? 'bg-amber-500/20 text-amber-500' : 'text-neutral-400'
                        }`}
                    title="Add Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={addImage}
                    className="p-2 rounded hover:bg-neutral-700 transition-colors text-neutral-400"
                    title="Add Image"
                >
                    <ImageIcon className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-neutral-700 mx-1" />

                {/* Undo/Redo */}
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className="p-2 rounded hover:bg-neutral-700 transition-colors text-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Undo (Ctrl+Z)"
                >
                    <Undo className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className="p-2 rounded hover:bg-neutral-700 transition-colors text-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Redo (Ctrl+Y)"
                >
                    <Redo className="w-4 h-4" />
                </button>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />
        </div>
    )
}
