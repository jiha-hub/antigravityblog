import { createClient } from '@/utils/supabase/server'
import Navbar from '@/components/Navbar'
import CategoryFilter from '@/components/CategoryFilter'
import BlogCard from '@/components/BlogCard'
import Pagination from '@/components/Pagination'
import Footer from '@/components/Footer'
import { ChevronDown } from 'lucide-react'

interface Post {
  id: string
  title: string
  subtitle: string
  reading_time: number
  image_url: string
  slug: string
  created_at: string
  category: {
    name: string
    slug: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
}

const POSTS_PER_PAGE = 6

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const { category: activeCategory, page } = await searchParams
  const currentPage = Number(page) || 1
  const supabase = await createClient()

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  // Fetch posts with count
  let query = supabase
    .from('posts')
    .select(`
      *,
      category:categories!category_id(name, slug)
    `, { count: 'exact' })

  if (activeCategory) {
    const cat = categories?.find(c => c.slug === activeCategory)
    if (cat) {
      query = query.eq('category_id', cat.id)
    }
  }

  const from = (currentPage - 1) * POSTS_PER_PAGE
  const to = from + POSTS_PER_PAGE - 1

  const { data: posts, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalPosts = count || 0
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar user={user} />

      <main className="container mx-auto flex-1 px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-16">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            최신 글
          </h1>
          <p className="text-lg text-slate-400">
            팀의 최신 생각과 튜토리얼을 살펴보세요.
          </p>
        </section>

        {/* Filters and Sorting */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-border pb-2 md:flex-row md:items-center">
          <CategoryFilter
            categories={categories || []}
            activeCategory={activeCategory || null}
          />

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>정렬 기준:</span>
            <button className="flex items-center gap-1 font-bold text-white">
              최신순
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Blog Grid */}
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                post={{
                  ...post,
                  category_name: post.category?.name,
                  category_slug: post.category?.slug
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border text-slate-500">
            <p className="text-lg">글이 아직 없습니다.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
          />
        )}
      </main>

      <Footer />
    </div>
  )
}

