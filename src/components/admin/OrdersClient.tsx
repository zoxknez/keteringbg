'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import OrderActions from './OrderActions'
import OrderStatusBadge from './OrderStatusBadge'
import OrdersSearch from './OrdersSearch'

interface Order {
    id: string
    clientName: string
    clientEmail: string
    status: string
    createdAt: Date
    eventDate: Date | null
    portions: number
    menu: {
        name: string
    }
}

interface OrdersClientProps {
    orders: Order[]
}

export default function OrdersClient({ orders }: OrdersClientProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchesSearch =
                searchQuery === '' ||
                order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.clientEmail.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesStatus = statusFilter === 'all' || order.status === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [orders, searchQuery, statusFilter])

    return (
        <>
            <OrdersSearch onSearch={setSearchQuery} onStatusFilter={setStatusFilter} />

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {filteredOrders.length === 0 ? (
                    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-8 text-center text-neutral-500">
                        {searchQuery || statusFilter !== 'all' ? 'Nema rezultata' : 'Nema narudžbina'}
                    </div>
                ) : (
                    filteredOrders.map((order) => (
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
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                                        {searchQuery || statusFilter !== 'all' ? 'Nema rezultata' : 'Nema narudžbina'}
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
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
        </>
    )
}
