'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export type AuthState = {
    message: string | null
    error: boolean
}

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { message: '이메일과 비밀번호를 입력해주세요.', error: true }
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { message: error.message, error: true }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(prevState: AuthState, formData: FormData): Promise<AuthState> {
    console.log('Signup action started...')
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const full_name = formData.get('full_name') as string

    if (!email || !password || !full_name) {
        return { message: '모든 필드를 입력해주세요.', error: true }
    }

    if (password.length < 6) {
        return { message: '비밀번호는 최소 6자 이상이어야 합니다.', error: true }
    }

    try {
        console.log('Attempting Supabase signUp for:', email)
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name,
                },
                emailRedirectTo: `${(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')}/auth/callback`,
            },
        })

        if (error) {
            console.error('Supabase signup error:', error.message)
            return { message: error.message, error: true }
        }

        console.log('Signup successful for:', email)
        return { message: '회원가입 확인 메일이 발송되었습니다. 이메일을 확인해주세요.', error: false }
    } catch (err) {
        console.error('Unhandled signup exception:', err)
        if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
            throw err
        }
        return { message: '서버 오류가 발생했습니다. 다시 시도해주세요.', error: true }
    }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    return redirect('/')
}
