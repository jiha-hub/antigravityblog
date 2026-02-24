import Link from 'next/link'
import { Clock } from 'lucide-react'

interface BlogCardProps {
    post: {
        id: string
        title: string
        subtitle: string
        reading_time: number
        image_url: string
        slug: string
        category_slug?: string
        category_name?: string
    }
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <Link
            href={`/posts/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-slate-900/50 transition-all hover:border-primary-blue/50 hover:shadow-2xl hover:shadow-blue-500/10"
        >
            {/* Image Container */}
            <div className="relative aspect-[16/9] overflow-hidden">
                <img
                    src={post.image_url}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {post.category_name && (
                    <div className="absolute left-4 top-4 rounded-lg bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                        {post.category_name}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary-blue">
                    {post.title}
                </h3>
                <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-slate-400">
                    {post.subtitle}
                </p>

                <div className="mt-auto flex items-center justify-between text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{post.reading_time}분 읽기</span>
                    </div>
                    {post.category_slug && (
                        <span className="text-primary-blue">#{post.category_slug}</span>
                    )}
                </div>
            </div>
        </Link>
    )
}
