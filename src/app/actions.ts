'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCategories() {
    const supabase = await createClient()
    const { data } = await supabase.from('categories').select('*').order('name')
    return data || []
}

export async function publishPost(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('로그인이 필요합니다.')
    }

    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const content = formData.get('content') as string
    const slug = formData.get('slug') as string
    const image_url = formData.get('image_url') as string
    const category_id = formData.get('category_id') as string
    const reading_time = parseInt(formData.get('reading_time') as string)

    const { error } = await supabase
        .from('posts')
        .insert([
            {
                title,
                subtitle,
                content,
                slug,
                image_url: image_url || null,
                category_id,
                reading_time,
                author_id: user.id,
            },
        ])

    if (error) {
        throw new Error(`발행 중 오류가 발생했습니다: ${error.message}`)
    }

    revalidatePath('/')
    return slug
}
