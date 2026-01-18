'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'

interface OrdersSearchProps {
    onSearch: (query: string) => void
    onStatusFilter: (status: string) => void
}

export default function OrdersSearch({ onSearch, onStatusFilter }: OrdersSearchProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('all')

    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
        onSearch(value)
    }

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value)
        onStatusFilter(value)
    }

    return (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search Input */}
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Pretraži po imenu ili email-u..."
                    className="block w-full pl-10 pr-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
            </div>

            {/* Status Filter */}
            <div className="relative sm:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-neutral-500" />
                </div>
                <select
                    value={selectedStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none cursor-pointer"
                >
                    <option value="all">Svi statusi</option>
                    <option value="PENDING">Na čekanju</option>
                    <option value="CONFIRMED">Potvrđeno</option>
                    <option value="COMPLETED">Završeno</option>
                    <option value="CANCELLED">Otkazano</option>
                </select>
            </div>
        </div>
    )
}
