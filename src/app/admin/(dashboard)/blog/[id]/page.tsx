import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import BlogForm from '@/components/admin/blog/BlogForm'

async function getBlogPost(id: string) {
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      videoEmbeds: true,
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  if (!post) {
    notFound()
  }

  return post
}

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session) {
    redirect('/admin/login')
  }

  const post = await getBlogPost(id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Izmeni Blog Post</h1>
        <p className="text-gray-600 mt-1">
          Izmenite postojeći blog post
        </p>
      </div>

      <BlogForm mode="edit" post={post as any} />
    </div>
  )
}
