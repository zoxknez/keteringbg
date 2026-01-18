import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import Pagination from '@/components/admin/Pagination'
import OrdersClient from '@/components/admin/OrdersClient'

const ITEMS_PER_PAGE = 20

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const skip = (currentPage - 1) * ITEMS_PER_PAGE

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: ITEMS_PER_PAGE,
      orderBy: { createdAt: 'desc' },
      include: {
        menu: true,
        selectedDishes: {
          include: { dish: true }
        }
      }
    }),
    prisma.order.count()
  ])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const pendingCount = orders.filter(o => o.status === 'PENDING').length
  const confirmedCount = orders.filter(o => o.status === 'CONFIRMED').length
  const completedCount = orders.filter(o => o.status === 'COMPLETED').length

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">Narudžbine</h1>
          <p className="text-neutral-500 mt-1 text-sm md:text-base">Upravljajte narudžbinama klijenata</p>
        </div>
        <Link
          href="/admin/orders/new"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-colors w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Narudžbina</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-3 md:p-4">
          <p className="text-neutral-500 text-xs md:text-sm">Ukupno</p>
          <p className="text-xl md:text-2xl font-bold text-white">{orders.length}</p>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-amber-500/30 p-3 md:p-4">
          <p className="text-amber-500 text-xs md:text-sm">Na čekanju</p>
          <p className="text-xl md:text-2xl font-bold text-amber-500">{pendingCount}</p>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-blue-500/30 p-3 md:p-4">
          <p className="text-blue-500 text-xs md:text-sm">Potvrđeno</p>
          <p className="text-xl md:text-2xl font-bold text-blue-500">{confirmedCount}</p>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-green-500/30 p-3 md:p-4">
          <p className="text-green-500 text-xs md:text-sm">Završeno</p>
          <p className="text-xl md:text-2xl font-bold text-green-500">{completedCount}</p>
        </div>
      </div>

      {/* Orders List with Search/Filter */}
      <OrdersClient orders={orders} />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl="/admin/orders"
      />
    </div>
  )
}
