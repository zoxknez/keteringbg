'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    baseUrl: string
    searchParams?: Record<string, string>
}

export default function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
    if (totalPages <= 1) return null

    const createUrl = (page: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', page.toString())
        return `${baseUrl}?${params.toString()}`
    }

    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push(1)
                pages.push('...')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalPages)
            }
        }

        return pages
    }

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-t border-neutral-800 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                {currentPage > 1 ? (
                    <Link
                        href={createUrl(currentPage - 1)}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-neutral-400 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700"
                    >
                        Previous
                    </Link>
                ) : (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-900 border border-neutral-800 rounded-lg cursor-not-allowed">
                        Previous
                    </span>
                )}
                {currentPage < totalPages ? (
                    <Link
                        href={createUrl(currentPage + 1)}
                        className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-neutral-400 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700"
                    >
                        Next
                    </Link>
                ) : (
                    <span className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-900 border border-neutral-800 rounded-lg cursor-not-allowed">
                        Next
                    </span>
                )}
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-neutral-500">
                        Stranica <span className="font-medium text-white">{currentPage}</span> od{' '}
                        <span className="font-medium text-white">{totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-lg shadow-sm" aria-label="Pagination">
                        {currentPage > 1 ? (
                            <Link
                                href={createUrl(currentPage - 1)}
                                className="relative inline-flex items-center rounded-l-lg px-2 py-2 text-neutral-400 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 focus:z-20"
                            >
                                <span className="sr-only">Previous</span>
                                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                            </Link>
                        ) : (
                            <span className="relative inline-flex items-center rounded-l-lg px-2 py-2 text-neutral-600 bg-neutral-900 border border-neutral-800 cursor-not-allowed">
                                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                            </span>
                        )}
                        {getPageNumbers().map((page, index) => {
                            if (page === '...') {
                                return (
                                    <span
                                        key={`ellipsis-${index}`}
                                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-500 bg-neutral-900 border border-neutral-800"
                                    >
                                        ...
                                    </span>
                                )
                            }
                            const pageNum = page as number
                            return pageNum === currentPage ? (
                                <span
                                    key={pageNum}
                                    aria-current="page"
                                    className="relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold text-black bg-amber-500 border border-amber-500 focus:z-20"
                                >
                                    {pageNum}
                                </span>
                            ) : (
                                <Link
                                    key={pageNum}
                                    href={createUrl(pageNum)}
                                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-400 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 focus:z-20"
                                >
                                    {pageNum}
                                </Link>
                            )
                        })}
                        {currentPage < totalPages ? (
                            <Link
                                href={createUrl(currentPage + 1)}
                                className="relative inline-flex items-center rounded-r-lg px-2 py-2 text-neutral-400 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 focus:z-20"
                            >
                                <span className="sr-only">Next</span>
                                <ChevronRight className="h-5 w-5" aria-hidden="true" />
                            </Link>
                        ) : (
                            <span className="relative inline-flex items-center rounded-r-lg px-2 py-2 text-neutral-600 bg-neutral-900 border border-neutral-800 cursor-not-allowed">
                                <ChevronRight className="h-5 w-5" aria-hidden="true" />
                            </span>
                        )}
                    </nav>
                </div>
            </div>
        </div>
    )
}
