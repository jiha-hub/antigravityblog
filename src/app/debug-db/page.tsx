import { createClient } from '@/utils/supabase/server'

export default async function DebugPage() {
    const supabase = await createClient()
    const { data: posts } = await supabase.from('posts').select('id, title, slug').order('created_at', { ascending: false })

    return (
        <div className="p-8 font-mono text-sm bg-black text-white">
            <h1 className="text-2xl mb-4 font-bold">Post Slug Debugger</h1>
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border p-2 text-left">ID</th>
                        <th className="border p-2 text-left">Title</th>
                        <th className="border p-2 text-left">Slug</th>
                    </tr>
                </thead>
                <tbody>
                    {posts?.map(p => (
                        <tr key={p.id}>
                            <td className="border p-2">{p.id}</td>
                            <td className="border p-2">{p.title}</td>
                            <td className="border p-2">{p.slug}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
