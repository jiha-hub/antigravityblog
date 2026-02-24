import Link from 'next/link'
import { Search, LogOut } from 'lucide-react'
import { User as SupabaseUser } from '@supabase/supabase-js'

import { signOut } from '@/app/(auth)/actions'

export default function Navbar({ user }: { user: SupabaseUser | null }) {

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-blue shadow-lg shadow-blue-500/20">
                            <div className="h-4 w-4 rotate-45 border-2 border-white"></div>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground">DevBlog</span>
                    </Link>

                    {/* Search bar */}
                    <div className="hidden flex-1 items-center justify-center md:flex max-w-md">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="검색..."
                                className="w-full rounded-xl border border-border bg-slate-900/50 py-2 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-slate-500 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                            />
                        </div>
                    </div>

                    {/* Nav Links & Auth */}
                    <nav className="flex items-center gap-2 sm:gap-6">
                        <div className="hidden items-center gap-6 md:flex mr-4">
                            <Link href="#" className="text-sm font-medium text-slate-400 transition-colors hover:text-foreground">글 목록</Link>
                            <Link href="#" className="text-sm font-medium text-slate-400 transition-colors hover:text-foreground">튜토리얼</Link>
                            <Link href="#" className="text-sm font-medium text-slate-400 transition-colors hover:text-foreground">코드 조각</Link>
                        </div>

                        {user ? (
                            <form action={signOut} className="flex items-center gap-4">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 rounded-lg border border-border bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-slate-700 active:scale-95"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:inline">로그아웃</span>
                                </button>
                            </form>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="hidden sm:inline-block rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:text-white"
                                >
                                    로그인
                                </Link>
                                <Link
                                    href="/signup"
                                    className="rounded-lg bg-primary-blue px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-primary-blue-hover active:scale-95"
                                >
                                    회원가입
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}
