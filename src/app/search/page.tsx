import { createClient } from '@/utils/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BlogCard from '@/components/BlogCard'
import Link from 'next/link'
import { Search } from 'lucide-react'

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams
    const query = q?.trim() || ''

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let posts: {
        id: string
        title: string
        subtitle: string
        reading_time: number
        image_url: string
        slug: string
        category_slug?: string
        category_name?: string
    }[] = []

    if (query) {
        const { data } = await supabase
            .from('posts')
            .select(`
                id, title, subtitle, reading_time, image_url, slug, created_at,
                category:categories(name, slug)
            `)
            .or(`title.ilike.%${query}%,subtitle.ilike.%${query}%,content.ilike.%${query}%`)
            .order('created_at', { ascending: false })
            .limit(20)

        posts = (data || []).map((p) => {
            const cat = Array.isArray(p.category)
                ? (p.category[0] as { name: string; slug: string } | undefined)
                : (p.category as { name: string; slug: string } | null)
            return {
                id: p.id,
                title: p.title,
                subtitle: p.subtitle,
                reading_time: p.reading_time,
                image_url: p.image_url,
                slug: p.slug,
                category_name: cat?.name,
                category_slug: cat?.slug,
            }
        })
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar user={user} />

            <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* 검색 헤더 */}
                <div className="mb-10 text-center">
                    <h1 className="mb-3 text-3xl font-extrabold text-foreground">글 검색</h1>
                    <p className="text-slate-500 text-sm">제목, 부제목, 내용으로 글을 검색합니다</p>
                </div>

                {/* 검색창 */}
                <form method="GET" action="/search" className="mb-12 max-w-2xl mx-auto">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            name="q"
                            defaultValue={query}
                            placeholder="키워드를 입력하세요 (예: React, 튜토리얼, Next.js...)"
                            autoFocus
                            className="w-full rounded-2xl border border-border bg-slate-900/50 py-4 pl-12 pr-6 text-base text-foreground outline-none transition-all placeholder:text-slate-500 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-primary-blue px-5 py-2 text-sm font-bold text-white transition-all hover:bg-primary-blue-hover active:scale-95"
                        >
                            검색
                        </button>
                    </div>
                </form>

                {/* 검색 결과 */}
                {query && (
                    <div>
                        <p className="mb-6 text-sm text-slate-500">
                            &quot;<span className="font-semibold text-white">{query}</span>&quot; 검색 결과{' '}
                            <span className="font-bold text-primary-blue">{posts.length}건</span>
                        </p>

                        {posts.length > 0 ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {posts.map((post) => (
                                    <BlogCard key={post.id} post={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-20 text-center">
                                <div className="mb-4 text-5xl">🔍</div>
                                <h2 className="mb-2 text-xl font-bold text-foreground">검색 결과가 없습니다</h2>
                                <p className="text-slate-500 text-sm mb-6">다른 키워드로 검색해보세요</p>
                                <Link
                                    href="/"
                                    className="rounded-xl bg-primary-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-blue-hover transition-all"
                                >
                                    전체 글 보기
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* 검색어 없을 때 */}
                {!query && (
                    <div className="flex flex-col items-center py-16 text-center text-slate-500">
                        <div className="mb-4 text-5xl">✍️</div>
                        <p className="text-sm">검색어를 입력해 글을 찾아보세요</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
