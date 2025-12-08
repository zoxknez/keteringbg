import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { UtensilsCrossed, BookOpen, ShoppingCart, TrendingUp, ChevronRight } from 'lucide-react'

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
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">Dashboard</h1>
        <p className="text-neutral-500 mt-1 text-sm md:text-base">Dobrodošli nazad u admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div 
              key={stat.label}
              className="bg-neutral-900 rounded-xl md:rounded-2xl p-4 md:p-6 border border-neutral-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-500 text-xs md:text-sm">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-${stat.color}-500/10 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 text-${stat.color}-500`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-neutral-900 rounded-xl md:rounded-2xl border border-neutral-800 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-neutral-800 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-white">Poslednje Narudžbine</h2>
          <Link 
            href="/admin/orders" 
            className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
          >
            Sve →
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
                className="p-4 md:p-6 flex items-center justify-between hover:bg-neutral-800/50 transition-colors block"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white truncate">{order.clientName}</p>
                  <p className="text-sm text-neutral-500 truncate">{order.menu.name}</p>
                </div>
                <div className="flex items-center gap-2 md:gap-4 ml-4">
                  <div className="text-right hidden sm:block">
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
                  {/* Mobile status dot */}
                  <div className={`sm:hidden w-3 h-3 rounded-full ${
                    order.status === 'COMPLETED' ? 'bg-green-500' :
                    order.status === 'PENDING' ? 'bg-amber-500' :
                    order.status === 'CONFIRMED' ? 'bg-blue-500' :
                    'bg-red-500'
                  }`} />
                  <ChevronRight className="w-5 h-5 text-neutral-500" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
