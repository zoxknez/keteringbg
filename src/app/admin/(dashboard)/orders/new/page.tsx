import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import NewOrderForm from './NewOrderForm'

export default async function NewOrderPage() {
  const [menus, dishes] = await Promise.all([
    prisma.menu.findMany({
      orderBy: { name: 'asc' }
    }),
    prisma.dish.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }]
    })
  ])

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Nova Narudžbina</h1>
          <p className="text-neutral-500 mt-1">Kreirajte narudžbinu ručno</p>
        </div>
      </div>

      <NewOrderForm menus={menus} dishes={dishes} />
    </div>
  )
}
