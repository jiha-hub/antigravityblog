'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Server Component Error:', error)
    }, [error])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
            <div className="mb-6 rounded-full bg-red-500/10 p-4 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-white">서버 오류가 발생했습니다</h2>
            <p className="mb-8 text-slate-400 max-w-md">
                페이지를 렌더링하는 중에 예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
                {error.digest && <span className="block mt-2 text-xs text-slate-600">ID: {error.digest}</span>}
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="rounded-lg bg-primary-blue px-6 py-2 text-sm font-bold text-white hover:bg-primary-blue-hover transition-colors"
                >
                    다시 시도
                </button>
                <button
                    onClick={() => window.location.href = '/'}
                    className="rounded-lg bg-slate-900 border border-border px-6 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
                >
                    홈으로 이동
                </button>
            </div>
        </div>
    )
}
