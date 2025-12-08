'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  BookOpen, 
  Image, 
  Settings, 
  LogOut,
  CheckCircle,
  ShoppingCart
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Narudžbine', icon: ShoppingCart },
  { href: '/admin/dishes', label: 'Jela', icon: UtensilsCrossed },
  { href: '/admin/menus', label: 'Meniji', icon: BookOpen },
  { href: '/admin/availability', label: 'Dostupnost', icon: CheckCircle },
  { href: '/admin/media', label: 'Mediji', icon: Image },
  { href: '/admin/settings', label: 'Podešavanja', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-800">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
            <span className="text-black font-bold text-lg">K</span>
          </div>
          <div>
            <h1 className="font-serif font-bold text-white">Ketering</h1>
            <p className="text-xs text-neutral-500">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href))
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-amber-500/10 text-amber-500' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-all mb-2"
        >
          <span className="text-sm">Pogledaj sajt →</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Odjavi se</span>
        </button>
      </div>
    </aside>
  )
}
