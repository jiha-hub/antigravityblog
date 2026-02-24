'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Category {
    id: string
    name: string
    slug: string
}

interface CategoryFilterProps {
    categories: Category[]
    activeCategory: string | null
}

export default function CategoryFilter({
    categories,
    activeCategory,
}: CategoryFilterProps) {
    const searchParams = useSearchParams()

    const createQueryString = (name: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(name, value)
        } else {
            params.delete(name)
        }
        params.delete('page') // 카테고리 변경 시 페이지 초기화
        return params.toString()
    }

    return (
        <div className="flex flex-wrap items-center gap-3 py-8">
            <Link
                href={`/?${createQueryString('category', null)}`}
                className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${activeCategory === null
                    ? 'bg-primary-blue text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
            >
                전체
            </Link>
            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={`/?${createQueryString('category', category.slug)}`}
                    className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${activeCategory === category.slug
                        ? 'bg-primary-blue text-white shadow-lg shadow-blue-500/20'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                        }`}
                >
                    {category.name}
                </Link>
            ))}
        </div>
    )
}
