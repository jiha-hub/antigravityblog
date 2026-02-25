'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { toggleLike } from '@/app/actions'

interface LikeButtonProps {
    postId: string
    initialCount: number
    initialLiked: boolean
}

export default function LikeButton({ postId, initialCount, initialLiked }: LikeButtonProps) {
    const [liked, setLiked] = useState(initialLiked)
    const [count, setCount] = useState(initialCount)
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        if (loading) return
        setLoading(true)

        // Optimistic update
        const nextLiked = !liked
        setLiked(nextLiked)
        setCount(prev => nextLiked ? prev + 1 : prev - 1)

        try {
            await toggleLike(postId)
        } catch {
            // Revert if failed
            setLiked(!nextLiked)
            setCount(prev => nextLiked ? prev - 1 : prev + 1)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all group ${liked
                    ? 'border-pink-500/50 bg-pink-500/10 text-pink-400'
                    : 'border-border bg-slate-900/50 text-slate-400 hover:border-pink-500/30 hover:bg-pink-500/5 hover:text-pink-400'
                }`}
        >
            <Heart
                className={`h-4 w-4 transition-transform group-hover:scale-110 ${liked ? 'fill-pink-400' : ''}`}
            />
            <span className="font-bold">{count}</span> 좋아요
        </button>
    )
}
