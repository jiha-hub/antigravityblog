import { createClient } from '@/utils/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ShareButtons from '@/components/ShareButtons'
import { Clock, Calendar, ChevronLeft, MessageSquare, Heart, Copy, Image as ImageIcon } from 'lucide-react'
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
          author:profiles(full_name, avatar_url)
        `)
        .eq('slug', slug)
        .single()

    if (!post) {
        notFound()
    }

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
                    {/* Share Sidebar - Hidden on mobile */}
                    <div className="hidden lg:block lg:w-16">
                        <div className="sticky top-28">
                            <ShareButtons />
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="max-w-4xl flex-1">
                        {/* Header Section */}
                        <div className="mb-12">
                            <div className="mb-6 flex items-center gap-3">
                                <span className="rounded-full bg-primary-blue/10 px-4 py-1.5 text-xs font-bold text-primary-blue uppercase tracking-wider">
                                    {post.category?.name}
                                </span>
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
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-6 border-y border-border py-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-800 flex items-center justify-center">
                                    {post.author?.avatar_url ? (
                                        <img
                                            src={post.author.avatar_url}
                                            alt={post.author.full_name || 'Author'}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-sm font-bold text-slate-500">
                                            {post.author?.full_name?.charAt(0) || '?'}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5 font-bold text-white">
                                        {post.author?.full_name || '익명 사용자'}
                                        <div className="h-4 w-4 rounded-full bg-primary-blue p-0.5 text-white">
                                            <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                        </div>
                                    </div>
                                    <div className="text-sm text-slate-500">Software Engineer</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-slate-900/50 text-slate-400 transition-all hover:bg-slate-800 hover:text-white">
                                    <Heart className="h-5 w-5" />
                                </button>
                                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-slate-900/50 text-slate-400 transition-all hover:bg-slate-800 hover:text-white">
                                    <MessageSquare className="h-5 w-5" />
                                </button>
                                <div className="h-6 w-px bg-border mx-2"></div>
                                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-slate-900/50 text-slate-400 transition-all hover:bg-slate-800 hover:text-white">
                                    <Copy className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content Section */}
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

                            {/* Interaction Footer */}
                            <div className="mt-16 flex items-center justify-between border-t border-border pt-8">
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-2 rounded-full border border-border bg-slate-900/50 px-4 py-2 text-sm transition-colors hover:bg-pink-500/10 hover:text-pink-500 group">
                                        <Heart className="h-4 w-4 transition-transform group-hover:scale-110" />
                                        <span className="font-bold">142</span> 좋아요
                                    </button>
                                    <button className="flex items-center gap-2 rounded-full border border-border bg-slate-900/50 px-4 py-2 text-sm transition-colors hover:bg-primary-blue/10 hover:text-primary-blue group">
                                        <MessageSquare className="h-4 w-4 transition-transform group-hover:scale-110" />
                                        <span className="font-bold">24개</span> 댓글
                                    </button>
                                </div>
                                <div className="text-sm text-slate-500">
                                    이 글이 도움이 되었나요?
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
