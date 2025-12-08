import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { UtensilsCrossed, BookOpen, ShoppingCart, TrendingUp, Eye } from 'lucide-react'

export default async function AdminDashboard() {
  const [dishCount, menuCount, orderCount] = await Promise.all([
    prisma.dish.count(),
    prisma.menu.count(),
    prisma.order.count(),
  ])

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { menu: true }
  })

  const stats = [
    { label: 'Ukupno Jela', value: dishCount, icon: UtensilsCrossed, color: 'amber' },
    { label: 'Menija', value: menuCount, icon: BookOpen, color: 'blue' },
    { label: 'Narudžbina', value: orderCount, icon: ShoppingCart, color: 'green' },
    { label: 'Ovog Meseca', value: '+12%', icon: TrendingUp, color: 'purple' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-white">Dashboard</h1>
        <p className="text-neutral-500 mt-1">Dobrodošli nazad u admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div 
              key={stat.label}
              className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-500`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Poslednje Narudžbine</h2>
          <Link 
            href="/admin/orders" 
            className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
          >
            Pogledaj sve →
          </Link>
        </div>
        <div className="divide-y divide-neutral-800">
          {recentOrders.length === 0 ? (
            <div className="p-6 text-center text-neutral-500">
              Nema narudžbina
            </div>
          ) : (
            recentOrders.map((order) => (
              <Link 
                key={order.id} 
                href={`/admin/orders/${order.id}`}
                className="p-6 flex items-center justify-between hover:bg-neutral-800/50 transition-colors block"
              >
                <div>
                  <p className="font-medium text-white">{order.clientName}</p>
                  <p className="text-sm text-neutral-500">{order.menu.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      order.status === 'COMPLETED' ? 'text-green-500' :
                      order.status === 'PENDING' ? 'text-amber-500' :
                      order.status === 'CONFIRMED' ? 'text-blue-500' :
                      'text-red-500'
                    }`}>
                      {order.status === 'PENDING' ? 'Na čekanju' :
                       order.status === 'CONFIRMED' ? 'Potvrđeno' :
                       order.status === 'COMPLETED' ? 'Završeno' : 'Otkazano'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString('sr-RS')}
                    </p>
                  </div>
                  <Eye className="w-5 h-5 text-neutral-500" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
