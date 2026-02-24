import { AuthForm } from '../components/auth-form'
import { login } from '../actions'

export default async function LoginPage({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ message: string }>
}) {
    const searchParams = await searchParamsPromise
    const message = searchParams.message

    return (
        <div className="min-h-screen flex flex-col">
            {/* 헤더 */}
            <header className="px-8 py-6 flex justify-between items-center border-b border-border">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white transform rotate-45"></div>
                    </div>
                    <span className="text-xl font-bold">DevBlog</span>
                </div>
                <nav className="hidden md:flex items-center gap-8 text-slate-400">
                    <a href="/" className="hover:text-white">Home</a>
                    <a href="#" className="hover:text-white">Articles</a>
                    <a href="#" className="hover:text-white">About</a>
                </nav>
            </header>

            {/* 메인 콘텐츠 */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-[480px]">
                    <AuthForm type="login" onSubmit={login} />
                    {message && (
                        <div className="mt-4 p-4 rounded-lg bg-slate-800 text-sm text-center text-slate-300 border border-border">
                            {decodeURIComponent(message)}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
