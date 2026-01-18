'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Home, Menu } from 'lucide-react'

export default function BlogNavbar() {
    const params = useParams()
    const locale = params?.locale as string || 'en'

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo / Brand */}
                    <Link
                        href={`/${locale}`}
                        className="flex items-center gap-3 group"
                    >
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/20 transition-all">
                            <span className="text-xl font-serif font-bold text-amber-500">K</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white group-hover:text-amber-500 transition-colors">
                                Ketering Beograd
                            </span>
                            <span className="text-xs text-neutral-500">Premium Catering</span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/${locale}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
                        >
                            <Home className="h-4 w-4" />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                        <Link
                            href={`/${locale}#menu`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
                        >
                            <Menu className="h-4 w-4" />
                            <span className="hidden sm:inline">Menu</span>
                        </Link>
                        <Link
                            href={`/${locale}/blog`}
                            className="px-4 py-2 text-sm text-white bg-amber-500/10 border border-amber-500/20 rounded-full hover:bg-amber-500/20 transition-all"
                        >
                            Blog
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
