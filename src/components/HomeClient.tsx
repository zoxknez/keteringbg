'use client'

import { motion } from 'framer-motion'
import MenuSelector from '@/components/MenuSelector'
import CorporateOffer from '@/components/CorporateOffer'
import ContactButton from '@/components/ContactButton'
import FoodGallery from '@/components/FoodGallery'
import { useTranslations } from 'next-intl'

type Menu = {
    id: string
    name: string
    dishCount: number
    price: number
    dishes: any[]
}

interface HomeClientProps {
    menus: Menu[]
}

export default function HomeClient({ menus }: HomeClientProps) {
    const tIndex = useTranslations('Index')
    const tMenu = useTranslations('Menu')

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center relative px-6 pt-20 pb-40 md:pt-0 md:pb-0">
                <div className="max-w-6xl mx-auto text-center space-y-12 animate-fade-in-up">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                        <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-neutral-400">
                            {tIndex('hero.badge')}
                        </span>
                    </div>

                    {/* Main Headline */}
                    <div className="space-y-4">
                        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold text-white tracking-tight leading-[0.9] drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            {tIndex('hero.titleLine1')}
                            <br />
                            <span className="italic text-amber-500 text-glow-amber">{tIndex('hero.titleLine2')}</span>
                        </h1>
                    </div>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
                        {tIndex.rich('hero.subtitle', {
                            bold: (chunks) => <span className="font-medium text-white">{chunks}</span>
                        })}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <a
                            href="#menu"
                            className="group px-10 py-5 bg-amber-500 text-black rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-amber-400 transition-all duration-500 shadow-xl shadow-amber-500/20"
                        >
                            <span className="flex items-center justify-center gap-3">
                                {tIndex('hero.ctaMenu')}
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </a>
                        <a
                            href="#gallery"
                            className="group px-10 py-5 bg-white/5 text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] border border-white/20 hover:bg-white/10 hover:border-amber-500/50 transition-all duration-500"
                        >
                            <span className="flex items-center justify-center gap-3">
                                {tIndex('hero.ctaGallery')}
                            </span>
                        </a>
                        <a
                            href="/blog"
                            className="group px-10 py-5 bg-white/5 text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] border border-white/20 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-500"
                        >
                            <span className="flex items-center justify-center gap-3">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                </svg>
                                Blog
                            </span>
                        </a>
                        <CorporateOffer />
                        <ContactButton />
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap items-center justify-center gap-8 pt-12 text-neutral-500 text-sm">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{tIndex('trust.events')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{tIndex('trust.experience')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{tIndex('trust.clients')}</span>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                    <div className="flex flex-col items-center gap-3 text-neutral-600">
                        <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-neutral-500">{tIndex('hero.scroll')}</span>
                        <div className="w-6 h-10 rounded-full border border-white/10 flex items-start justify-center p-1.5 bg-white/5 backdrop-blur-sm">
                            <motion.div
                                animate={{
                                    y: [0, 16, 0],
                                    opacity: [0.3, 1, 0.3]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="w-1 h-2.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Menu Section */}
            <section id="menu" className="py-32 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-amber-500">{tMenu('sectionLabel')}</span>
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-white">{tMenu('sectionTitle')}</h2>
                        <p className="text-neutral-500 max-w-xl mx-auto font-light leading-relaxed">{tMenu('sectionDescription')}</p>

                        <div className="pt-8 flex flex-col items-center gap-6">
                            <div className="inline-flex items-center gap-4 px-8 py-4 bg-amber-900/10 border border-amber-500/20 rounded-2xl shadow-2xl shadow-amber-500/5 backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-black text-amber-500/90 uppercase tracking-widest">
                                    {tIndex('hero.notice24h')}
                                </span>
                            </div>
                            <div className="inline-flex items-center gap-4 px-8 py-4 bg-emerald-900/10 border border-emerald-500/20 rounded-2xl shadow-2xl shadow-emerald-500/5 backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-black text-emerald-500/90 uppercase tracking-widest">
                                    {tMenu('minPortionsNoticeMain')}
                                </span>
                            </div>
                        </div>
                    </div>
                    <MenuSelector menus={menus} />
                </div>
            </section>

            {/* Food Gallery Section */}
            <FoodGallery />
        </div>
    )
}
