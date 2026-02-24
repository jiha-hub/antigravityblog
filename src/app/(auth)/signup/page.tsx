import { AuthForm } from '../components/auth-form'
import { signup } from '../actions'

export default async function SignUpPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-950">
            {/* 헤더 */}
            <header className="px-8 py-6 flex justify-between items-center border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <div className="w-4 h-4 border-2 border-white transform rotate-45"></div>
                    </div>
                    <span className="text-xl font-bold text-white">DevBlog</span>
                </div>
                <nav className="hidden md:flex items-center gap-8 text-slate-400">
                    <a href="/" className="hover:text-white transition-colors">Home</a>
                    <a href="#" className="hover:text-white transition-colors">Articles</a>
                    <a href="#" className="hover:text-white transition-colors">About</a>
                </nav>
            </header>

            {/* 메인 콘텐츠 */}
            <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
                {/* 배경 효과 */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-blue/10 rounded-full blur-[128px] -z-10"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px] -z-10"></div>

                <div className="w-full max-w-[480px]">
                    <AuthForm type="signup" action={signup} />
                </div>
            </main>
        </div>
    )
}
