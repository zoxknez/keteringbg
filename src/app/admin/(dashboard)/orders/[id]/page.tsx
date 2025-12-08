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
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <Link
            href="/admin/orders"
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl md:text-3xl font-serif font-bold text-white">
              Narudžbina #{order.id.slice(-6).toUpperCase()}
            </h1>
            <p className="text-neutral-500 mt-1 text-xs md:text-base">
              {new Date(order.createdAt).toLocaleString('sr-RS')}
            </p>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Mobile: Status & Actions First */}
      <div className="lg:hidden space-y-4">
        <OrderStatusChanger orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Client Info */}
          <div className="bg-neutral-900 rounded-xl md:rounded-2xl border border-neutral-800 overflow-hidden">
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-neutral-800 bg-neutral-800/50">
              <h2 className="text-base md:text-lg font-semibold text-white flex items-center gap-2">
                <User className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                Podaci o Klijentu
              </h2>
            </div>
            <div className="p-4 md:p-6 space-y-3 md:space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 md:w-5 md:h-5 text-neutral-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-neutral-500">Ime</p>
                  <p className="text-white font-medium truncate">{order.clientName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-neutral-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-neutral-500">Email</p>
                  <a href={`mailto:${order.clientEmail}`} className="text-amber-500 hover:underline text-sm md:text-base break-all">
                    {order.clientEmail}
                  </a>
                </div>
              </div>
              {order.clientPhone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-neutral-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs md:text-sm text-neutral-500">Telefon</p>
                    <a href={`tel:${order.clientPhone}`} className="text-amber-500 hover:underline">
                      {order.clientPhone}
                    </a>
                  </div>
                </div>
              )}
              {order.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-neutral-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs md:text-sm text-neutral-500">Adresa</p>
                    <p className="text-white text-sm md:text-base">{order.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Selected Dishes */}
          <div className="bg-neutral-900 rounded-xl md:rounded-2xl border border-neutral-800 overflow-hidden">
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-neutral-800 bg-neutral-800/50">
              <h2 className="text-base md:text-lg font-semibold text-white flex items-center gap-2">
                <Package className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                Izabrana Jela ({order.selectedDishes.length})
              </h2>
            </div>
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              {appetizers.length > 0 && (
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-neutral-500 mb-2 md:mb-3">PREDJELA</h3>
                  <div className="space-y-2">
                    {appetizers.map(({ dish }) => (
                      <div key={dish.id} className="flex items-center gap-3 p-2 md:p-3 bg-neutral-800 rounded-lg md:rounded-xl">
                        {dish.imageUrl ? (
                          <img src={dish.imageUrl} alt={dish.name} className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-neutral-700 flex items-center justify-center flex-shrink-0">🍽️</div>
                        )}
                        <span className="text-white font-medium text-sm md:text-base truncate">{dish.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {mains.length > 0 && (
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-neutral-500 mb-2 md:mb-3">GLAVNA JELA</h3>
                  <div className="space-y-2">
                    {mains.map(({ dish }) => (
                      <div key={dish.id} className="flex items-center gap-3 p-2 md:p-3 bg-neutral-800 rounded-lg md:rounded-xl">
                        {dish.imageUrl ? (
                          <img src={dish.imageUrl} alt={dish.name} className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-neutral-700 flex items-center justify-center flex-shrink-0">🍽️</div>
                        )}
                        <span className="text-white font-medium text-sm md:text-base truncate">{dish.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {desserts.length > 0 && (
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-neutral-500 mb-2 md:mb-3">DESERTI</h3>
                  <div className="space-y-2">
                    {desserts.map(({ dish }) => (
                      <div key={dish.id} className="flex items-center gap-3 p-2 md:p-3 bg-neutral-800 rounded-lg md:rounded-xl">
                        {dish.imageUrl ? (
                          <img src={dish.imageUrl} alt={dish.name} className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-neutral-700 flex items-center justify-center flex-shrink-0">🍽️</div>
                        )}
                        <span className="text-white font-medium text-sm md:text-base truncate">{dish.name}</span>
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
            <div className="bg-neutral-900 rounded-xl md:rounded-2xl border border-neutral-800 overflow-hidden">
              <div className="px-4 md:px-6 py-3 md:py-4 border-b border-neutral-800 bg-neutral-800/50">
                <h2 className="text-base md:text-lg font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                  Poruka od Klijenta
                </h2>
              </div>
              <div className="p-4 md:p-6">
                <p className="text-neutral-300 whitespace-pre-wrap text-sm md:text-base">{order.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Desktop */}
        <div className="space-y-4 md:space-y-6">
          {/* Order Summary */}
          <div className="bg-neutral-900 rounded-xl md:rounded-2xl border border-neutral-800 overflow-hidden">
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-neutral-800 bg-neutral-800/50">
              <h2 className="text-base md:text-lg font-semibold text-white">Detalji Narudžbine</h2>
            </div>
            <div className="p-4 md:p-6 space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 text-sm">Meni</span>
                <span className="text-white font-medium text-sm md:text-base">{order.menu.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 text-sm">Porcija</span>
                <span className="text-white font-medium">{order.portions}</span>
              </div>
              {order.menu.price && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 text-sm">Cena</span>
                  <span className="text-white font-medium">{Number(order.menu.price).toLocaleString('sr-RS')} RSD</span>
                </div>
              )}
              <div className="border-t border-neutral-800 pt-3 md:pt-4">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs md:text-sm">Kreirano</span>
                </div>
                <p className="text-white mt-1 text-sm">
                  {new Date(order.createdAt).toLocaleString('sr-RS')}
                </p>
              </div>
              {order.eventDate && (
                <div>
                  <div className="flex items-center gap-2 text-amber-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs md:text-sm">Datum događaja</span>
                  </div>
                  <p className="text-white mt-1 text-sm">
                    {new Date(order.eventDate).toLocaleDateString('sr-RS')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Status Changer - Desktop Only */}
          <div className="hidden lg:block">
            <OrderStatusChanger orderId={order.id} currentStatus={order.status} />
          </div>

          {/* Delete Button */}
          <OrderDeleteButton orderId={order.id} />
        </div>
      </div>
    </div>
  )
}
