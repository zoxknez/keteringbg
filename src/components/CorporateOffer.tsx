'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { X, Building2, CheckCircle2, ArrowLeft } from 'lucide-react'

export default function CorporateOffer() {
  const t = useTranslations('Index.hero')
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-10 py-5 bg-white/5 text-white rounded-full font-semibold text-sm uppercase tracking-widest border border-white/20 hover:bg-white/10 hover:border-amber-500/50 transition-all duration-500"
      >
        {t('ctaCorporate')}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl p-8 z-50 shadow-2xl shadow-amber-500/10"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 left-4 p-2 text-neutral-400 hover:text-white transition-colors flex items-center gap-2 md:hidden"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
                  <Building2 className="w-8 h-8 text-amber-500" />
                </div>

                <h3 className="text-2xl font-serif font-bold text-white mb-4">
                  {t('corporateModal.title')}
                </h3>
                
                <p className="text-neutral-400 mb-8 leading-relaxed">
                  {t('corporateModal.description')}
                </p>

                <div className="w-full space-y-3 mb-8 text-left">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 text-neutral-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span>{t(`corporateModal.benefits.${i}`)}</span>
                    </div>
                  ))}
                </div>

                <a 
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 bg-amber-500 text-black rounded-xl font-semibold uppercase tracking-widest hover:bg-amber-400 transition-colors"
                >
                  {t('corporateModal.contact')}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
