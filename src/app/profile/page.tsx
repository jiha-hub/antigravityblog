import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getProfile } from './actions'
import ProfileForm from './components/ProfileForm'

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const profile = await getProfile()

    return (
        <div className="min-h-screen bg-background">
            <Navbar user={user} />

            <main className="container mx-auto max-w-2xl px-4 py-12 sm:px-6">
                {/* 헤더 */}
                <div className="mb-10">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 border border-border text-3xl">
                            {profile?.avatar_url || '🧑‍💻'}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                {profile?.full_name || '사용자'}
                            </h1>
                            <p className="text-sm text-slate-500">{user.email}</p>
                            {profile?.job && (
                                <span className="mt-1 inline-block rounded-full bg-primary-blue/10 px-2.5 py-0.5 text-xs font-medium text-blue-300">
                                    {profile.job}
                                </span>
                            )}
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">프로필을 설정하면 작성한 글에 표시됩니다.</p>
                </div>

                {/* 폼 카드 */}
                <div className="rounded-2xl border border-border bg-slate-900/50 p-6 sm:p-8">
                    <h2 className="text-lg font-semibold text-foreground mb-6">프로필 설정</h2>
                    <ProfileForm initialData={profile} />
                </div>
            </main>

            <Footer />
        </div>
    )
}
