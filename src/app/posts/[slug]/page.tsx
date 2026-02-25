import { createClient } from '@/utils/supabase/server'

// Always render fresh — prevents Next.js fetch cache returning stale 404 for newly published posts
export const dynamic = 'force-dynamic'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ShareButtons from '@/components/ShareButtons'
import LikeButton from '@/components/LikeButton'
import CommentSection from '@/components/CommentSection'
import { Clock, Calendar, ChevronLeft, Image as ImageIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function PostDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const supabase = await createClient()

    try {
        console.log(`[PostDetail] Attempting to fetch post with slug: "${slug}"`)
        const { data: { user } } = await supabase.auth.getUser()

        // Main post query — explicitly specify foreign keys to avoid ambiguous relationship error (PGRST201)
        const { data: rawPost, error: postError } = await supabase
            .from('posts')
            .select(`
              *,
              category:categories!category_id(name, slug),
              author:profiles!author_id(full_name, avatar_url)
            `)
            .eq('slug', slug)
            .single()

        if (postError || !rawPost) {
            console.error(`[PostDetail] Error or No Post for slug "${slug}":`, postError)
            notFound()
        }

        // Resilient data normalization: handle both single object and array-of-one formats
        const normalize = (val: any) => Array.isArray(val) ? val[0] : val

        const post = {
            ...rawPost,
            category: normalize(rawPost.category),
            author: normalize(rawPost.author)
        }

        const postId = post.id as string
        console.log(`[PostDetail] Found post ID: ${postId}. Fetching secondary data...`)

        const [likeCountResult, userLikedResult, commentsResult, tagsResult] = await Promise.allSettled([
            supabase.from('likes').select('*', { count: 'exact', head: true }).eq('post_id', postId),
            user ? supabase.from('likes').select('post_id').eq('post_id', postId).eq('user_id', user.id).maybeSingle() : Promise.resolve({ data: null }),
            supabase.from('comments').select('id, content, created_at, author:profiles!author_id(full_name, avatar_url)').eq('post_id', postId).order('created_at', { ascending: true }),
            supabase.from('post_tags').select('tag:tags(name, slug)').eq('post_id', postId),
        ])

        const likeCount = likeCountResult.status === 'fulfilled' ? (likeCountResult.value.count ?? 0) : 0
        const userLiked = userLikedResult.status === 'fulfilled' ? !!userLikedResult.value.data : false

        const comments = (commentsResult.status === 'fulfilled' ? (commentsResult.value.data ?? []) : []).map((c: any) => ({
            id: c.id,
            content: c.content,
            created_at: c.created_at,
            author: normalize(c.author),
        }))

        const tags = (tagsResult.status === 'fulfilled' ? (tagsResult.value.data ?? []) : []).map((pt: any) => normalize(pt.tag)).filter(Boolean)

        // Safe date parse
        const formatDate = (dateStr: string) => {
            try {
                const d = new Date(dateStr)
                if (isNaN(d.getTime())) return '메타데이터 오류'
                return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
            } catch { return '날짜 오류' }
        }

        return (
            <div className="flex min-h-screen flex-col bg-background text-foreground">
                <Navbar user={user} />
                <main className="container mx-auto flex-1 px-4 py-12 sm:px-6 lg:px-8">
                    <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white">
                        <ChevronLeft className="h-4 w-4" /> 돌아가기
                    </Link>

                    <div className="flex flex-col gap-12 lg:flex-row">
                        <div className="hidden lg:block lg:w-16"><div className="sticky top-28"><ShareButtons /></div></div>
                        <div className="max-w-4xl flex-1">
                            <div className="mb-12">
                                <div className="mb-6 flex flex-wrap items-center gap-3">
                                    {post.category?.name && (
                                        <span className="rounded-full bg-primary-blue/10 px-4 py-1.5 text-xs font-bold text-primary-blue uppercase tracking-wider">
                                            {post.category.name}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500"><Clock className="h-3.5 w-3.5" /><span>{post.reading_time || 0}분 읽기</span></div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500"><Calendar className="h-3.5 w-3.5" /><span>{formatDate(post.created_at)}</span></div>
                                </div>
                                <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{post.title}</h1>
                                <p className="text-xl leading-relaxed text-slate-400 sm:text-2xl">{post.subtitle}</p>
                                {tags.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {tags.map((tag: any) => (<span key={tag.slug} className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400">#{tag.name}</span>))}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-6 border-y border-border py-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-800 flex items-center justify-center text-2xl">{post.author?.avatar_url || '🧑‍💻'}</div>
                                    <div className="font-bold text-white">{post.author?.full_name || '익명 사용자'}</div>
                                </div>
                            </div>

                            <div className="mt-12">
                                <div className="mb-12 overflow-hidden rounded-2xl border border-border bg-slate-900/50">
                                    {post.image_url ? (
                                        <img src={post.image_url} alt={post.title} className="w-full object-cover aspect-[16/9]" />
                                    ) : (
                                        <div className="flex aspect-[16/9] items-center justify-center bg-slate-900 text-slate-700"><ImageIcon className="h-12 w-12" /></div>
                                    )}
                                </div>
                                <div className="prose prose-invert max-w-none text-slate-300 leading-8">
                                    <ReactMarkdown>{post.content || post.subtitle || '내용이 없습니다.'}</ReactMarkdown>
                                </div>

                                <div className="mt-16 flex items-center justify-between border-t border-border pt-8">
                                    <LikeButton postId={post.id} initialCount={likeCount ?? 0} initialLiked={userLiked} />
                                    <div className="text-sm text-slate-500">이 글이 도움이 되었나요?</div>
                                </div>

                                <CommentSection postId={post.id} comments={comments ?? []} isLoggedIn={!!user} />
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    } catch (err) {
        console.error("[PostDetail CRITICAL CRASH]:", err)
        throw err // Re-throw to trigger Next.js error page properly if resilience fails, but at least we logged it.
    }
}
