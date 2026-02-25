'use client'

import React, { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import {
    Bold, Italic, Link2, Code, Quote, Image as ImageIcon,
    List, Eye, EyeOff, Settings, Loader2
} from 'lucide-react'
import { uploadImage } from '@/app/actions'

interface MarkdownEditorProps {
    content: string
    onChange: (content: string) => void
}

export default function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
    const [isPreview, setIsPreview] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const insertText = (before: string, after: string = '') => {
        const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const text = textarea.value
        const selectedText = text.substring(start, end)

        const newText = text.substring(0, start) + before + selectedText + after + text.substring(end)
        onChange(newText)

        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + before.length, end + before.length)
        }, 0)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const url = await uploadImage(file)
            insertText(`![${file.name}](${url})`)
        } catch (err) {
            alert((err as Error).message || '이미지 업로드에 실패했습니다.')
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    return (
        <div className="flex flex-col h-full bg-slate-950/20 rounded-xl border border-border overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-slate-900/50">
                <div className="flex items-center gap-1 group">
                    <button onClick={() => insertText('**', '**')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors" title="굵게"><Bold size={18} /></button>
                    <button onClick={() => insertText('_', '_')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors" title="기울임"><Italic size={18} /></button>
                    <button onClick={() => insertText('[', '](url)')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors" title="링크"><Link2 size={18} /></button>
                    <div className="w-px h-4 bg-border mx-1" />
                    <button onClick={() => insertText('`', '`')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors" title="코드"><Code size={18} /></button>
                    <button onClick={() => insertText('> ')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors" title="인용구"><Quote size={18} /></button>

                    {/* Image Upload Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
                        title="이미지 업로드"
                    >
                        {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />

                    <button onClick={() => insertText('- ')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors" title="리스트"><List size={18} /></button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsPreview(!isPreview)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isPreview
                            ? 'bg-primary-blue text-white shadow-lg shadow-blue-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        {isPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                        <span>{isPreview ? '미리보기 끔' : '미리보기 켬'}</span>
                    </button>
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors">
                        <Settings size={18} />
                    </button>
                </div>
            </div>

            {/* Editor & Preview Area */}
            <div className="flex-1 flex overflow-hidden min-h-[500px]">
                {/* Editor Area */}
                <div className={`flex-1 flex flex-col ${isPreview ? 'hidden md:flex' : 'flex'}`}>
                    <textarea
                        id="markdown-editor"
                        value={content}
                        onChange={(e) => onChange(e.target.value)}
                        className="flex-1 w-full bg-transparent p-6 font-mono text-sm leading-relaxed text-slate-300 outline-none resize-none placeholder:text-slate-600"
                        placeholder="이곳에 마크다운 내용을 입력하세요..."
                    />
                </div>

                {/* Preview Area */}
                {isPreview && (
                    <div className="flex-1 border-l border-border bg-slate-900/30 overflow-y-auto p-6 prose prose-invert max-w-none">
                        <ReactMarkdown>{content || '*미리보기할 내용이 없습니다.*'}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    )
}
