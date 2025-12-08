import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Clock, Package, MessageSquare } from 'lucide-react'
import OrderStatusBadge from '../OrderStatusBadge'
import OrderStatusChanger from './OrderStatusChanger'
import OrderDeleteButton from './OrderDeleteButton'

export default async function OrderDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      menu: true,
      selectedDishes: {
        include: { dish: true }
      }
    }
  })

  if (!order) {
    notFound()
  }

  const appetizers = order.selectedDishes.filter(d => d.dish.category === 'APPETIZER')
  const mains = order.selectedDishes.filter(d => d.dish.category === 'MAIN')
  const desserts = order.selectedDishes.filter(d => d.dish.category === 'DESSERT')

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">
              Narudžbina #{order.id.slice(-6).toUpperCase()}
            </h1>
            <p className="text-neutral-500 mt-1">
              Kreirana: {new Date(order.createdAt).toLocaleString('sr-RS')}
            </p>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Info */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-800/50">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-amber-500" />
                Podaci o Klijentu
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-neutral-500 mt-0.5" />
                <div>
                  <p className="text-sm text-neutral-500">Ime</p>
                  <p className="text-white font-medium">{order.clientName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-neutral-500 mt-0.5" />
                <div>
                  <p className="text-sm text-neutral-500">Email</p>
                  <a href={`mailto:${order.clientEmail}`} className="text-amber-500 hover:underline">
                    {order.clientEmail}
                  </a>
                </div>
              </div>
              {order.clientPhone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-neutral-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-500">Telefon</p>
                    <a href={`tel:${order.clientPhone}`} className="text-amber-500 hover:underline">
                      {order.clientPhone}
                    </a>
                  </div>
                </div>
              )}
              {order.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-neutral-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-500">Adresa</p>
                    <p className="text-white">{order.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Selected Dishes */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-800/50">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-500" />
                Izabrana Jela ({order.selectedDishes.length})
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {appetizers.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-3">PREDJELA</h3>
                  <div className="space-y-2">
                    {appetizers.map(({ dish }) => (
                      <div key={dish.id} className="flex items-center gap-3 p-3 bg-neutral-800 rounded-xl">
                        {dish.imageUrl ? (
                          <img src={dish.imageUrl} alt={dish.name} className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-neutral-700 flex items-center justify-center">🍽️</div>
                        )}
                        <span className="text-white font-medium">{dish.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {mains.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-3">GLAVNA JELA</h3>
                  <div className="space-y-2">
                    {mains.map(({ dish }) => (
                      <div key={dish.id} className="flex items-center gap-3 p-3 bg-neutral-800 rounded-xl">
                        {dish.imageUrl ? (
                          <img src={dish.imageUrl} alt={dish.name} className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-neutral-700 flex items-center justify-center">🍽️</div>
                        )}
                        <span className="text-white font-medium">{dish.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {desserts.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-3">DESERTI</h3>
                  <div className="space-y-2">
                    {desserts.map(({ dish }) => (
                      <div key={dish.id} className="flex items-center gap-3 p-3 bg-neutral-800 rounded-xl">
                        {dish.imageUrl ? (
                          <img src={dish.imageUrl} alt={dish.name} className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-neutral-700 flex items-center justify-center">🍽️</div>
                        )}
                        <span className="text-white font-medium">{dish.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {order.selectedDishes.length === 0 && (
                <p className="text-neutral-500 text-center py-4">Nema izabranih jela</p>
              )}
            </div>
          </div>

          {/* Message */}
          {order.message && (
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-800/50">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  Poruka od Klijenta
                </h2>
              </div>
              <div className="p-6">
                <p className="text-neutral-300 whitespace-pre-wrap">{order.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-800/50">
              <h2 className="text-lg font-semibold text-white">Detalji Narudžbine</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Meni</span>
                <span className="text-white font-medium">{order.menu.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Porcija</span>
                <span className="text-white font-medium">{order.portions}</span>
              </div>
              {order.menu.price && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Cena po porciji</span>
                  <span className="text-white font-medium">{Number(order.menu.price).toLocaleString('sr-RS')} RSD</span>
                </div>
              )}
              <div className="border-t border-neutral-800 pt-4">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Kreirano</span>
                </div>
                <p className="text-white mt-1">
                  {new Date(order.createdAt).toLocaleString('sr-RS')}
                </p>
              </div>
              {order.eventDate && (
                <div>
                  <div className="flex items-center gap-2 text-amber-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Datum događaja</span>
                  </div>
                  <p className="text-white mt-1">
                    {new Date(order.eventDate).toLocaleDateString('sr-RS')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Status Changer */}
          <OrderStatusChanger orderId={order.id} currentStatus={order.status} />

          {/* Delete Button */}
          <OrderDeleteButton orderId={order.id} />
        </div>
      </div>
    </div>
  )
}
