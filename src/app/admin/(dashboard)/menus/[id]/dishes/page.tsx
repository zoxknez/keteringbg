import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import MenuDishesManager from './MenuDishesManager'

export default async function MenuDishesPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  const [menu, allDishes] = await Promise.all([
    prisma.menu.findUnique({
      where: { id },
      include: { dishes: true }
    }),
    prisma.dish.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }]
    })
  ])

  if (!menu) {
    notFound()
  }

  const menuDishIds = menu.dishes.map(d => d.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/menus"
          className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">
            Jela u meniju: {menu.name}
          </h1>
          <p className="text-neutral-500 mt-1">
            Izaberite {menu.dishCount} jela za ovaj meni ({menuDishIds.length} izabrano)
          </p>
        </div>
      </div>

      <MenuDishesManager 
        menuId={menu.id}
        menuDishCount={menu.dishCount}
        selectedDishIds={menuDishIds}
        allDishes={allDishes}
      />
    </div>
  )
}
