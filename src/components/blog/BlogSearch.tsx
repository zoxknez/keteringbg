'use client'

import { Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface BlogSearchProps {
    onSearch: (query: string) => void
    placeholder?: string
}

export default function BlogSearch({ onSearch, placeholder = 'Search posts...' }: BlogSearchProps) {
    const [query, setQuery] = useState('')
    const [debouncedQuery, setDebouncedQuery] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query)
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    useEffect(() => {
        onSearch(debouncedQuery)
    }, [debouncedQuery, onSearch])

    const handleClear = () => {
        setQuery('')
        setDebouncedQuery('')
    }

    return (
        <div className="relative max-w-2xl mx-auto">
            <div className="relative glass-card rounded-full overflow-hidden">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Search className={`h-5 w-5 transition-all duration-300 ${query ? 'text-amber-500' : ''}`} />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-transparent pl-16 pr-16 py-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded-full transition-all"
                />
                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    )
}
