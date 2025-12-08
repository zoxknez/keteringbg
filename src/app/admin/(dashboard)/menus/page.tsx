import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil, UtensilsCrossed } from 'lucide-react'
import MenuActions from './MenuActions'

export default async function MenusPage() {
  const menus = await prisma.menu.findMany({
    orderBy: { dishCount: 'asc' },
    include: {
      dishes: true,
      _count: { select: { orders: true } }
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Meniji</h1>
          <p className="text-neutral-500 mt-1">Upravljajte paketima menija</p>
        </div>
        <Link
          href="/admin/menus/new"
          className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novi Meni
        </Link>
      </div>

      {/* Menu Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <div 
            key={menu.id}
            className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-colors"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-800">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">{menu.name}</h3>
                  <p className="text-amber-500 font-medium mt-1">
                    {menu.price ? `${menu.price.toString()} RSD` : 'Cena po dogovoru'}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/menus/${menu.id}`}
                    className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <MenuActions menuId={menu.id} menuName={menu.name} />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Broj jela</span>
                <span className="text-white font-medium">{menu.dishCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Dodeljenih jela</span>
                <span className="text-white font-medium">{menu.dishes.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Narudžbina</span>
                <span className="text-white font-medium">{menu._count.orders}</span>
              </div>

              {/* Dishes Preview */}
              {menu.dishes.length > 0 && (
                <div className="pt-4 border-t border-neutral-800">
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-3">Jela u meniju</p>
                  <div className="flex flex-wrap gap-2">
                    {menu.dishes.slice(0, 5).map((dish) => (
                      <span 
                        key={dish.id}
                        className="px-2 py-1 bg-neutral-800 rounded-md text-xs text-neutral-300"
                      >
                        {dish.name}
                      </span>
                    ))}
                    {menu.dishes.length > 5 && (
                      <span className="px-2 py-1 bg-neutral-800 rounded-md text-xs text-neutral-500">
                        +{menu.dishes.length - 5} više
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-neutral-800/50 border-t border-neutral-800">
              <Link
                href={`/admin/menus/${menu.id}/dishes`}
                className="flex items-center justify-center gap-2 text-amber-500 hover:text-amber-400 font-medium transition-colors"
              >
                <UtensilsCrossed className="w-4 h-4" />
                Upravljaj jelima
              </Link>
            </div>
          </div>
        ))}

        {menus.length === 0 && (
          <div className="col-span-full bg-neutral-900 rounded-2xl border border-neutral-800 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed className="w-8 h-8 text-neutral-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Nema menija</h3>
            <p className="text-neutral-500 mb-6">Kreirajte prvi meni za vaše klijente</p>
            <Link
              href="/admin/menus/new"
              className="inline-flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-5 h-5" />
              Novi Meni
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
