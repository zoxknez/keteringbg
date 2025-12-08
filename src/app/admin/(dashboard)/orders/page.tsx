import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Eye, Plus } from 'lucide-react'
import OrderActions from './OrderActions'
import OrderStatusBadge from './OrderStatusBadge'

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { 
      menu: true,
      selectedDishes: {
        include: { dish: true }
      }
    }
  })

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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {orders.length === 0 ? (
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-8 text-center text-neutral-500">
            Nema narudžbina
          </div>
        ) : (
          orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="block bg-neutral-900 rounded-xl border border-neutral-800 p-4 hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-white">{order.clientName}</p>
                  <p className="text-sm text-neutral-500">{order.clientEmail}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">{order.menu.name}</span>
                <span className="text-neutral-500">
                  {new Date(order.createdAt).toLocaleDateString('sr-RS')}
                </span>
              </div>
              {order.eventDate && (
                <p className="text-xs text-amber-500 mt-2">
                  Event: {new Date(order.eventDate).toLocaleDateString('sr-RS')}
                </p>
              )}
            </Link>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-800/50">
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-400">Klijent</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-400">Meni</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-400">Porcija</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-400">Datum</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-400">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-neutral-400">Akcije</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    Nema narudžbina
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">{order.clientName}</p>
                        <p className="text-sm text-neutral-500">{order.clientEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-300">{order.menu.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-300">{order.portions}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-neutral-300">
                          {new Date(order.createdAt).toLocaleDateString('sr-RS')}
                        </p>
                        {order.eventDate && (
                          <p className="text-xs text-amber-500">
                            Event: {new Date(order.eventDate).toLocaleDateString('sr-RS')}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
                          title="Pregledaj"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <OrderActions orderId={order.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
