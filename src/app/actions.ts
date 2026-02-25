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
    const rawSlug = (formData.get('slug') as string)?.trim()
    const slug = rawSlug || `post-${Date.now()}` // always ensure a valid slug
    const image_url = formData.get('image_url') as string
    const category_id = formData.get('category_id') as string
    const reading_time = parseInt(formData.get('reading_time') as string)
    const tagsRaw = formData.get('tags') as string

    const { data: post, error } = await supabase
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
        .select('id')
        .single()

    if (error || !post) {
        throw new Error(`발행 중 오류가 발생했습니다: ${error?.message}`)
    }

    // Handle tags
    if (tagsRaw?.trim()) {
        const tagNames = tagsRaw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)

        for (const name of tagNames) {
            const tagSlug = name.replace(/\s+/g, '-')

            // Upsert tag
            const { data: tag } = await supabase
                .from('tags')
                .upsert({ name, slug: tagSlug }, { onConflict: 'slug' })
                .select('id')
                .single()

            if (tag) {
                await supabase.from('post_tags').insert({ post_id: post.id, tag_id: tag.id })
            }
        }
    }

    revalidatePath('/')
    return slug
}

export async function addComment(postId: string, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('로그인이 필요합니다.')

    const { error } = await supabase.from('comments').insert({
        post_id: postId,
        author_id: user.id,
        content,
    })

    if (error) throw new Error(error.message)
    revalidatePath(`/posts`)
}

export async function toggleLike(postId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('로그인이 필요합니다.')

    const { data: existing } = await supabase
        .from('likes')
        .select('post_id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle()

    if (existing) {
        await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id)
    } else {
        await supabase.from('likes').insert({ post_id: postId, user_id: user.id })
    }

    revalidatePath(`/posts`)
    return !existing
}

export async function uploadImage(file: File): Promise<string> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('로그인이 필요합니다.')

    const ext = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${ext}`

    const { error } = await supabase.storage
        .from('post-images')
        .upload(fileName, file, { upsert: false })

    if (error) throw new Error(`이미지 업로드 실패: ${error.message}`)

    const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName)

    return publicUrl
}
