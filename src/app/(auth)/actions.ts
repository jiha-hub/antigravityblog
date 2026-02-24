'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return redirect(`/login?message=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    return redirect('/')
}

export async function signup(formData: FormData) {
    console.log('Signup action started...')
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const full_name = formData.get('full_name') as string

    try {
        console.log('Attempting Supabase signUp for:', email)
        const { data, error } = await supabase.auth.signUp({
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
            return redirect(`/signup?message=${encodeURIComponent(error.message)}`)
        }

        console.log('Signup successful for:', email)
        return redirect('/login?message=회원가입 확인 메일이 발송되었습니다.')
    } catch (err) {
        console.error('Unhandled signup exception:', err)
        if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
            throw err
        }
        return redirect(`/signup?message=서버 오류가 발생했습니다. 다시 시도해주세요.`)
    }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    return redirect('/')
}
