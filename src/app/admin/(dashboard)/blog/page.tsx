import { Suspense } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'

async function getBlogPosts() {
  return await prisma.blogPost.findMany({
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      videoEmbeds: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

const categoryLabels: Record<string, string> = {
  NEWS: 'Vesti',
  RECIPES: 'Recepti',
  EVENTS: 'Događaji',
  TIPS: 'Saveti',
  BEHIND_SCENES: 'Iza kulisa',
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blog Postovi</h1>
          <p className="text-gray-600 mt-1">
            Upravljajte blog postovima sa video sadržajem
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novi Post
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Naslov
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategorija
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Autor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Video Klipovi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Datum
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <p className="text-lg mb-2">Nema blog postova</p>
                    <p className="text-sm">Kreirajte prvi blog post</p>
                  </div>
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      {post.coverImage && (
                        <img
                          src={post.coverImage}
                          alt=""
                          className="h-12 w-12 rounded object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {post.title}
                        </div>
                        {post.excerpt && (
                          <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                            {post.excerpt}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {categoryLabels[post.category]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.author.name || post.author.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.videoEmbeds.length > 0 ? (
                      <span className="text-orange-600 font-medium">
                        {post.videoEmbeds.length} video(a)
                      </span>
                    ) : (
                      <span className="text-gray-400">Nema videa</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {post.isPublished ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <Eye className="h-3 w-3 mr-1" />
                        Objavljeno
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('sr-RS')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="text-orange-600 hover:text-orange-900 mr-4"
                    >
                      <Edit className="h-4 w-4 inline" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
