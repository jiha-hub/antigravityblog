'use client'

import { useState } from 'react'
import { MessageSquare, Send } from 'lucide-react'
import { addComment } from '@/app/actions'
import { useRouter } from 'next/navigation'

interface Comment {
    id: string
    content: string
    created_at: string
    author: {
        full_name: string | null
        avatar_url: string | null
    } | null
}

interface CommentSectionProps {
    postId: string
    comments: Comment[]
    isLoggedIn: boolean
}

export default function CommentSection({ postId, comments: initialComments, isLoggedIn }: CommentSectionProps) {
    const [comments, setComments] = useState(initialComments)
    const [newComment, setNewComment] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return

        setSubmitting(true)
        setError(null)
        try {
            await addComment(postId, newComment.trim())
            setNewComment('')
            router.refresh()
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="mt-16 border-t border-border pt-10">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-foreground">
                <MessageSquare className="h-5 w-5 text-primary-blue" />
                댓글 {comments.length}개
            </h2>

            {/* 댓글 작성 */}
            {isLoggedIn ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="relative">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="댓글을 입력하세요..."
                            rows={3}
                            className="w-full rounded-xl border border-border bg-slate-900/50 px-4 py-3 pr-14 text-sm text-foreground outline-none transition-all placeholder:text-slate-500 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 resize-none"
                        />
                        <button
                            type="submit"
                            disabled={submitting || !newComment.trim()}
                            className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary-blue text-white transition-all hover:bg-primary-blue-hover disabled:opacity-40"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                    {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
                </form>
            ) : (
                <div className="mb-8 rounded-xl border border-border bg-slate-900/30 px-4 py-3 text-sm text-slate-500">
                    댓글을 작성하려면{' '}
                    <a href="/login" className="text-primary-blue hover:underline">로그인</a>
                    이 필요합니다.
                </div>
            )}

            {/* 댓글 목록 */}
            {comments.length === 0 ? (
                <p className="text-center text-sm text-slate-500 py-8">첫 번째 댓글을 남겨보세요!</p>
            ) : (
                <ul className="space-y-4">
                    {comments.map((comment) => (
                        <li key={comment.id} className="flex gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-base">
                                {comment.author?.avatar_url || '🧑‍💻'}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-semibold text-foreground">
                                        {comment.author?.full_name || '익명'}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {new Date(comment.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">{comment.content}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
