import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function Footer() {
  const t = await getTranslations('Footer')
  const settings = await prisma.siteSettings.findFirst()

  const contactPhone = settings?.contactPhone || '+381 63 704 4428'
  const contactEmail = settings?.contactEmail || 'spalevic.dragan@gmail.com'
  const address = settings?.address || 'Vojvode Stepe 451A, Beograd (Voždovac)'
  const instagramUrl = settings?.instagramUrl || '#'
  const facebookUrl = settings?.facebookUrl || '#'

  return (
    <footer className="relative z-10 bg-black text-neutral-400 border-t border-white/5">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-3xl font-serif font-bold text-white">
              {t('brand').split(' ')[0]} <span className="text-amber-500">{t('brand').split(' ').slice(1).join(' ')}</span>
            </h3>
            <p className="text-neutral-400 leading-relaxed max-w-md">
              {t('description')}
            </p>
            <div className="flex gap-4 pt-2">
              {facebookUrl && (
                <a 
                  href={facebookUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-amber-500 flex items-center justify-center transition-colors duration-300 text-white"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {instagramUrl && (
                <a 
                  href={instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-amber-500 flex items-center justify-center transition-colors duration-300 text-white"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">{t('contact')}</h4>
            <div className="space-y-4">
              <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-neutral-800 group-hover:bg-amber-500 flex items-center justify-center transition-colors duration-300">
                  <Phone className="w-4 h-4 group-hover:text-white" />
                </div>
                <span className="group-hover:text-white transition-colors">{contactPhone}</span>
              </a>
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-neutral-800 group-hover:bg-amber-500 flex items-center justify-center transition-colors duration-300">
                  <Mail className="w-4 h-4 group-hover:text-white" />
                </div>
                <span className="group-hover:text-white transition-colors text-sm">{contactEmail}</span>
              </a>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm">{address}</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">{t('info')}</h4>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-white">Dragan Spalević PR</p>
              <p className="text-neutral-500">{t('cateringBelgrade')}</p>
              <p className="text-neutral-500">PIB: 114970001</p>
              <p className="text-neutral-500">MB: 67992032</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} {t('cateringBelgrade')}. {t('rights')}
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-white">
              {t('designedBy')} <a href="https://mojportfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 transition-colors font-medium">o0o0o0o</a>
            </p>
            {/* Discreet Admin Link */}
            <Link 
              href="/admin" 
              className="text-neutral-700 hover:text-neutral-500 transition-colors"
              title="Admin"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
