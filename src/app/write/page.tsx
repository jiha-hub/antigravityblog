'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCategories, publishPost } from '@/app/actions'
import { ChevronRight, Save, Send, AlertCircle, ImageIcon, X, Tag } from 'lucide-react'
import MarkdownEditor from '@/components/MarkdownEditor'

export default function WritePage() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [content, setContent] = useState('')
    const [slug, setSlug] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [readingTime, setReadingTime] = useState(5)
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([])
    const [isPublishing, setIsPublishing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')

    useEffect(() => {
        const loadCategories = async () => {
            const data = await getCategories()
            setCategories(data)
            if (data.length > 0) setCategoryId(data[0].id)
        }
        loadCategories()
    }, [])

    useEffect(() => {
        const base = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')  // strip non-ASCII (including Korean)
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
        // Fallback for Korean-only titles that produce an empty slug
        setSlug(base || `post-${Date.now()}`)
    }, [title])

    const addTag = () => {
        const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
        if (tag && !tags.includes(tag) && tags.length < 10) {
            setTags([...tags, tag])
        }
        setTagInput('')
    }

    const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag))

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addTag()
        }
    }

    const handlePublish = async () => {
        const safeSlug = slug?.trim() || `post-${Date.now()}`
        if (!title || !content || !categoryId) {
            setError('제목, 내용, 카테고리를 모두 입력해 주세요.')
            return
        }

        setIsPublishing(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('title', title)
            formData.append('subtitle', subtitle)
            formData.append('content', content)
            formData.append('slug', safeSlug)
            formData.append('image_url', imageUrl)
            formData.append('category_id', categoryId)
            formData.append('reading_time', readingTime.toString())
            formData.append('tags', tags.join(','))

            const publishedSlug = await publishPost(formData)
            router.push(`/posts/${publishedSlug}`)
            router.refresh()
        } catch (e: unknown) {
            const message = (e as Error).message
            setError(message)
            setIsPublishing(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-950 text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border bg-slate-950/80 backdrop-blur-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
                            <div
                                onClick={() => router.push('/')}
                                className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
                            >
                                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary-blue/20">
                                    <div className="h-3 w-3 rotate-45 border border-primary-blue"></div>
                                </div>
                                <span className="font-bold text-white">DevBlog</span>
                            </div>
                            <ChevronRight size={14} className="text-slate-600" />
                            <span className="text-white">새 글 작성</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 rounded-lg bg-slate-900 border border-border px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
                                <Save size={16} />
                                <span>임시 저장</span>
                            </button>
                            <button
                                onClick={handlePublish}
                                disabled={isPublishing}
                                className="flex items-center gap-2 rounded-lg bg-primary-blue px-6 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-primary-blue-hover active:scale-95 disabled:opacity-50 transition-all"
                            >
                                {isPublishing ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                ) : (
                                    <Send size={16} />
                                )}
                                <span>발행하기</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto flex-1 flex flex-col px-4 py-8 sm:px-6 lg:px-8 max-w-6xl">
                {error && (
                    <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-500">
                        <AlertCircle size={18} />
                        <p>{error}</p>
                    </div>
                )}

                <div className="space-y-6 mb-8">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        className="w-full bg-transparent text-5xl font-extrabold text-white outline-none placeholder:text-slate-800"
                    />
                    <input
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="부제목을 추가하세요 (선택 사항)"
                        className="w-full bg-transparent text-xl text-slate-400 outline-none placeholder:text-slate-900"
                    />

                    <div className="flex flex-wrap gap-6 pt-4">
                        {/* 카테고리 */}
                        <div className="flex-1 min-w-[180px] space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">카테고리</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full bg-slate-900 border border-border rounded-lg px-4 py-2 text-sm text-white focus:border-primary-blue outline-none appearance-none cursor-pointer"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* 슬러그 */}
                        <div className="flex-1 min-w-[180px] space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">슬러그 (URL)</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full bg-slate-900 border border-border rounded-lg px-4 py-2 text-sm text-white focus:border-primary-blue outline-none"
                            />
                        </div>

                        {/* 섬네일 이미지 URL */}
                        <div className="flex-1 min-w-[180px] space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                <ImageIcon size={12} />
                                섬네일 이미지 URL
                            </label>
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-slate-900 border border-border rounded-lg px-4 py-2 text-sm text-white focus:border-primary-blue outline-none"
                            />
                        </div>

                        {/* 읽기 시간 */}
                        <div className="w-28 space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">읽기 시간</label>
                            <input
                                type="number"
                                value={readingTime}
                                onChange={(e) => setReadingTime(parseInt(e.target.value))}
                                className="w-full bg-slate-900 border border-border rounded-lg px-4 py-2 text-sm text-white focus:border-primary-blue outline-none"
                            />
                        </div>
                    </div>

                    {/* 태그 */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                            <Tag size={12} />
                            태그 (Enter 또는 쉼표로 추가, 최대 10개)
                        </label>
                        <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-slate-900 px-3 py-2 min-h-[44px]">
                            {tags.map(tag => (
                                <span
                                    key={tag}
                                    className="flex items-center gap-1 rounded-full bg-primary-blue/10 px-3 py-1 text-xs font-medium text-blue-300"
                                >
                                    #{tag}
                                    <button onClick={() => removeTag(tag)} className="text-blue-400 hover:text-white">
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                onBlur={addTag}
                                placeholder={tags.length === 0 ? "태그 입력..." : ""}
                                className="flex-1 min-w-[120px] bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Editor */}
                <div className="flex-1 min-h-[500px]">
                    <MarkdownEditor content={content} onChange={setContent} />
                </div>
            </main>
        </div>
    )
}
