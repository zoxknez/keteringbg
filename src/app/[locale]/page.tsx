import { prisma } from '@/lib/prisma'
import MenuSelector from '@/components/MenuSelector'
import { getTranslations } from 'next-intl/server'

export const revalidate = 3600 // Revalidate every hour

export default async function Home() {
  const t = await getTranslations('Index')
  const menusData = await prisma.menu.findMany({
    orderBy: { price: 'asc' },
    include: { dishes: true }
  })
  
  const menus = menusData.map(menu => ({
    ...menu,
    price: menu.price ? menu.price.toNumber() : 0
  }))

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative px-6 pt-20 pb-40 md:pt-0 md:pb-0">
        <div className="max-w-6xl mx-auto text-center space-y-12 animate-fade-in-up">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-neutral-400">
              {t('hero.badge')}
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold text-white tracking-tight leading-[0.9]">
              {t('hero.titleLine1')}
              <br />
              <span className="italic text-amber-500">{t('hero.titleLine2')}</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            {t.rich('hero.subtitle', {
              bold: (chunks) => <span className="font-medium text-white">{chunks}</span>
            })}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a 
              href="#menu" 
              className="group px-10 py-5 bg-amber-500 text-black rounded-full font-semibold text-sm uppercase tracking-widest hover:bg-amber-400 transition-all duration-500 shadow-xl shadow-amber-500/20"
            >
              <span className="flex items-center justify-center gap-3">
                {t('hero.ctaMenu')}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>
            <a 
              href="#contact" 
              className="px-10 py-5 bg-white/5 text-white rounded-full font-semibold text-sm uppercase tracking-widest border border-white/20 hover:bg-white/10 hover:border-amber-500/50 transition-all duration-500"
            >
              {t('hero.ctaCorporate')}
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-12 text-neutral-500 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{t('trust.events')}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t('trust.experience')}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t('trust.clients')}</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-neutral-600">
            <span className="text-xs tracking-widest uppercase">{t('hero.scroll')}</span>
            <div className="w-6 h-10 rounded-full border-2 border-neutral-700 flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-amber-500 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-500">Naši Meniji</span>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-white">Izaberite Vaš Meni</h2>
            <p className="text-neutral-500 max-w-xl mx-auto">Kreirajte savršen meni za vašu priliku - od elegantnih koktela do raskošnih gozbi</p>
          </div>
          <MenuSelector menus={menus} />
        </div>
      </section>
    </div>
  )
}
