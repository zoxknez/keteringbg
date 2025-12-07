'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const onSelectChange = (nextLocale: string) => {
    startTransition(() => {
      // Replace the locale in the pathname
      // e.g. /sr/about -> /en/about
      const segments = pathname.split('/')
      segments[1] = nextLocale
      router.replace(segments.join('/'))
    })
  }

  const languageNames: Record<string, string> = {
    sr: 'Srpski',
    en: 'English', 
    ru: 'Русский'
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Mobile - Full width language bar */}
      <div className="md:hidden w-full bg-black/90 backdrop-blur-lg border-b border-white/10">
        <div className="flex justify-center gap-2 px-4 py-3">
          {['sr', 'en', 'ru'].map((cur) => (
            <button
              key={cur}
              onClick={() => onSelectChange(cur)}
              disabled={isPending}
              className={`
                flex-1 text-sm font-semibold uppercase tracking-wider transition-all duration-300 py-3 px-4 rounded-xl
                ${locale === cur 
                  ? 'text-black bg-amber-500' 
                  : 'text-neutral-400 bg-white/5 hover:bg-white/10 hover:text-white'}
              `}
            >
              {languageNames[cur]}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop - Floating pill */}
      <div className="hidden md:flex absolute top-6 right-6 gap-3 bg-neutral-900/80 backdrop-blur rounded-full px-4 py-2 border border-white/10">
        {['sr', 'en', 'ru'].map((cur) => (
          <button
            key={cur}
            onClick={() => onSelectChange(cur)}
            disabled={isPending}
            className={`
              text-xs font-bold uppercase tracking-wider transition-all duration-300 relative py-1 px-2 rounded-full
              ${locale === cur 
                ? 'text-black bg-amber-500' 
                : 'text-neutral-500 hover:text-white'}
            `}
          >
            {cur}
          </button>
        ))}
      </div>
    </header>
  )
}
