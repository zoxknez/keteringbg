import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import BlogForm from '@/components/admin/blog/BlogForm'

export default async function NewBlogPage() {
  const session = await auth()
  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Novi Blog Post</h1>
        <p className="text-gray-600 mt-1">
          Kreirajte novi blog post sa video sadržajem
        </p>
      </div>

      <BlogForm mode="create" />
    </div>
  )
}
