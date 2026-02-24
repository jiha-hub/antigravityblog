import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-border bg-slate-900/50 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-primary-blue/20">
                            <div className="h-3 w-3 rotate-45 border border-primary-blue"></div>
                        </div>
                        <span className="text-lg font-bold text-foreground">DevBlog</span>
                    </div>

                    <div className="flex gap-8 text-sm text-slate-400">
                        <Link href="#" className="hover:text-white transition-colors">이용약관</Link>
                        <Link href="#" className="hover:text-white transition-colors">개인정보처리방침</Link>
                        <Link href="#" className="hover:text-white transition-colors">고객센터</Link>
                    </div>

                    <p className="text-sm text-slate-500">
                        © 2024 DevBlog. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
