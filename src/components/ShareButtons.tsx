'use client'

import { Share2, Bookmark, Check, Copy } from 'lucide-react'
import { useState } from 'react'

export default function ShareButtons() {
    const [copied, setCopied] = useState(false)

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex flex-col gap-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">공유</p>
            <div className="flex flex-col gap-2">
                <button
                    onClick={handleCopyLink}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-slate-900/50 text-slate-400 transition-all hover:border-primary-blue/50 hover:bg-slate-800 hover:text-white"
                    title="링크 복사"
                >
                    {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                </button>
                <button
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-slate-900/50 text-slate-400 transition-all hover:border-primary-blue/50 hover:bg-slate-800 hover:text-white"
                    title="북마크"
                >
                    <Bookmark className="h-5 w-5" />
                </button>
                <button
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-slate-900/50 text-slate-400 transition-all hover:border-primary-blue/50 hover:bg-slate-800 hover:text-white"
                    title="더 보기"
                >
                    <Share2 className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
}
