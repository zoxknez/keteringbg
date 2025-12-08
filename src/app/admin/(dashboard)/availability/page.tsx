import { prisma } from '@/lib/prisma'
import AvailabilityToggle from '@/components/admin/AvailabilityToggle'

export default async function AvailabilityPage() {
  const dishes = await prisma.dish.findMany({
    orderBy: [
      { category: 'asc' },
      { name: 'asc' }
    ]
  })

  const appetizers = dishes.filter(d => d.category === 'APPETIZER')
  const mains = dishes.filter(d => d.category === 'MAIN')
  const desserts = dishes.filter(d => d.category === 'DESSERT')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-white">Dostupnost Jela</h1>
        <p className="text-neutral-500 mt-1">
          Brzo uključite/isključite jela koja su dostupna danas
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <AvailabilityToggle action="enableAll" />
        <AvailabilityToggle action="disableAll" />
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {/* Appetizers */}
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-800/50">
            <h2 className="text-lg font-semibold text-white">Predjela</h2>
            <p className="text-sm text-neutral-500">{appetizers.filter(d => d.isAvailable).length} od {appetizers.length} dostupno</p>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {appetizers.map(dish => (
              <AvailabilityToggle key={dish.id} dish={dish} />
            ))}
          </div>
        </div>

        {/* Mains */}
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-800/50">
            <h2 className="text-lg font-semibold text-white">Glavna Jela</h2>
            <p className="text-sm text-neutral-500">{mains.filter(d => d.isAvailable).length} od {mains.length} dostupno</p>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {mains.map(dish => (
              <AvailabilityToggle key={dish.id} dish={dish} />
            ))}
          </div>
        </div>

        {/* Desserts */}
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-800/50">
            <h2 className="text-lg font-semibold text-white">Deserti</h2>
            <p className="text-sm text-neutral-500">{desserts.filter(d => d.isAvailable).length} od {desserts.length} dostupno</p>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {desserts.map(dish => (
              <AvailabilityToggle key={dish.id} dish={dish} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
