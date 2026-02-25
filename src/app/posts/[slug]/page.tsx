import { createClient } from '@/utils/supabase/server'
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

    const { data: { user } } = await supabase.auth.getUser()

    const { data: post } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(name, slug),
          author:profiles(full_name, avatar_url),
          tags:post_tags(tag:tags(name, slug))
        `)
        .eq('slug', slug)
        .single()

    if (!post) {
        notFound()
    }

    // Fetch likes count and whether current user liked this post
    const { count: likeCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id)

    let userLiked = false
    if (user) {
        const { data: likeData } = await supabase
            .from('likes')
            .select('post_id')
            .eq('post_id', post.id)
            .eq('user_id', user.id)
            .maybeSingle()
        userLiked = !!likeData
    }

    // Fetch comments with author profiles
    const { data: rawComments } = await supabase
        .from('comments')
        .select(`
            id, content, created_at,
            author:profiles(full_name, avatar_url)
        `)
        .eq('post_id', post.id)
        .order('created_at', { ascending: true })

    // Supabase returns joined tables as arrays; normalise to single object
    const comments = (rawComments || []).map((c) => {
        const authorArr = c.author as { full_name: string | null; avatar_url: string | null }[] | null
        return {
            id: c.id as string,
            content: c.content as string,
            created_at: c.created_at as string,
            author: authorArr?.[0] ?? null,
        }
    })

    const tags = post.tags?.map((t: { tag: { name: string; slug: string } }) => t.tag) || []

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Navbar user={user} />

            <main className="container mx-auto flex-1 px-4 py-12 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link
                    href="/"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
                >
                    <ChevronLeft className="h-4 w-4" />
                    돌아가기
                </Link>

                <div className="flex flex-col gap-12 lg:flex-row">
                    {/* Share Sidebar */}
                    <div className="hidden lg:block lg:w-16">
                        <div className="sticky top-28">
                            <ShareButtons />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-4xl flex-1">
                        {/* Header */}
                        <div className="mb-12">
                            <div className="mb-6 flex flex-wrap items-center gap-3">
                                {post.category?.name && (
                                    <span className="rounded-full bg-primary-blue/10 px-4 py-1.5 text-xs font-bold text-primary-blue uppercase tracking-wider">
                                        {post.category.name}
                                    </span>
                                )}
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{post.reading_time}분 읽기</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>{new Date(post.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                            </div>

                            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                                {post.title}
                            </h1>
                            <p className="text-xl leading-relaxed text-slate-400 sm:text-2xl">
                                {post.subtitle}
                            </p>

                            {/* Tags */}
                            {tags.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {tags.map((tag: { name: string; slug: string }) => (
                                        <span key={tag.slug} className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
                                            #{tag.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Author / Actions Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-6 border-y border-border py-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-800 flex items-center justify-center text-2xl">
                                    {post.author?.avatar_url || '🧑‍💻'}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5 font-bold text-white">
                                        {post.author?.full_name || '익명 사용자'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mt-12">
                            <div className="mb-12 overflow-hidden rounded-2xl border border-border bg-slate-900/50">
                                {post.image_url ? (
                                    <img
                                        src={post.image_url}
                                        alt={post.title}
                                        className="w-full object-cover aspect-[16/9]"
                                    />
                                ) : (
                                    <div className="flex aspect-[16/9] items-center justify-center bg-slate-900 text-slate-700">
                                        <ImageIcon className="h-12 w-12" />
                                    </div>
                                )}
                            </div>

                            <div className="prose prose-invert max-w-none text-slate-300 leading-8">
                                <ReactMarkdown>
                                    {post.content || post.subtitle || '내용이 없습니다.'}
                                </ReactMarkdown>
                            </div>

                            {/* Like / Comment Buttons */}
                            <div className="mt-16 flex items-center justify-between border-t border-border pt-8">
                                <div className="flex items-center gap-4">
                                    <LikeButton
                                        postId={post.id}
                                        initialCount={likeCount ?? 0}
                                        initialLiked={userLiked}
                                    />
                                </div>
                                <div className="text-sm text-slate-500">
                                    이 글이 도움이 되었나요?
                                </div>
                            </div>

                            {/* Comments */}
                            <CommentSection
                                postId={post.id}
                                comments={comments ?? []}
                                isLoggedIn={!!user}
                            />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
