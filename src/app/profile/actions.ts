'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type ProfileState = {
    message: string | null
    error: boolean
}

export async function getProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
        .from('profiles')
        .select('id, full_name, job, avatar_url')
        .eq('id', user.id)
        .single()

    return data
}

export async function updateProfile(
    prevState: ProfileState,
    formData: FormData
): Promise<ProfileState> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { message: '로그인이 필요합니다.', error: true }
    }

    const full_name = formData.get('full_name') as string
    const job = formData.get('job') as string
    const avatar_url = formData.get('avatar_url') as string

    if (!full_name?.trim()) {
        return { message: '닉네임을 입력해주세요.', error: true }
    }

    const { error } = await supabase
        .from('profiles')
        .update({ full_name: full_name.trim(), job: job?.trim() || null, avatar_url })
        .eq('id', user.id)

    if (error) {
        return { message: '프로필 업데이트에 실패했습니다.', error: true }
    }

    revalidatePath('/profile')
    return { message: '✅ 프로필이 저장되었습니다!', error: false }
}
