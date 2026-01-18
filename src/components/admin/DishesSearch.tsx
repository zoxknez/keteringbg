'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'

interface DishesSearchProps {
    onSearch: (query: string) => void
    onCategoryFilter: (category: string) => void
}

const categories = [
    { value: 'all', label: 'Sve kategorije' },
    { value: 'CHICKEN', label: 'Piletina' },
    { value: 'PORK', label: 'Svinjetina' },
    { value: 'BEEF', label: 'Junetina' },
    { value: 'MIXED', label: 'Mešano' },
    { value: 'FISH', label: 'Riba' },
    { value: 'FASTING', label: 'Posno' },
]

export default function DishesSearch({ onSearch, onCategoryFilter }: DishesSearchProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')

    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
        onSearch(value)
    }

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value)
        onCategoryFilter(value)
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
                    placeholder="Pretraži jela..."
                    className="block w-full pl-10 pr-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
            </div>

            {/* Category Filter */}
            <div className="relative sm:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-neutral-500" />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none cursor-pointer"
                >
                    {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}
