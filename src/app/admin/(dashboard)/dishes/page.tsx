import { prisma } from '@/lib/prisma'
import DishesTable from '@/components/admin/DishesTable'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import Pagination from '@/components/admin/Pagination'

const ITEMS_PER_PAGE = 30

export default async function DishesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const skip = (currentPage - 1) * ITEMS_PER_PAGE

  const [dishes, totalCount] = await Promise.all([
    prisma.dish.findMany({
      skip,
      take: ITEMS_PER_PAGE,
      orderBy: { name: 'asc' },
      include: { menus: true }
    }),
    prisma.dish.count()
  ])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Jela</h1>
          <p className="text-neutral-500 mt-1">Upravljajte jelima na meniju</p>
        </div>
        <Link
          href="/admin/dishes/new"
          className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Dodaj Jelo
        </Link>
      </div>

      {/* Table */}
      <DishesTable dishes={dishes} />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl="/admin/dishes"
      />
    </div>
  )
}
