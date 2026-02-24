'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface PaginationProps {
    currentPage: number
    totalPages: number
}

export default function Pagination({
    currentPage,
    totalPages,
}: PaginationProps) {
    const searchParams = useSearchParams()
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    const createQueryString = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page.toString())
        return params.toString()
    }

    return (
        <div className="flex items-center justify-center gap-2 py-12">
            {currentPage > 1 ? (
                <Link
                    href={`/?${createQueryString(currentPage - 1)}`}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-slate-800 text-slate-400 transition-all hover:bg-slate-700 hover:text-white"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
            ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-slate-800 text-slate-400 opacity-30">
                    <ChevronLeft className="h-5 w-5" />
                </div>
            )}

            <div className="flex items-center gap-2">
                {pages.map((page) => (
                    <Link
                        key={page}
                        href={`/?${createQueryString(page)}`}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-all ${currentPage === page
                            ? 'bg-primary-blue text-white shadow-lg shadow-blue-500/20'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                            }`}
                    >
                        {page}
                    </Link>
                ))}
            </div>

            {currentPage < totalPages ? (
                <Link
                    href={`/?${createQueryString(currentPage + 1)}`}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-slate-800 text-slate-400 transition-all hover:bg-slate-700 hover:text-white"
                >
                    <ChevronRight className="h-5 w-5" />
                </Link>
            ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-slate-800 text-slate-400 opacity-30">
                    <ChevronRight className="h-5 w-5" />
                </div>
            )}
        </div>
    )
}
