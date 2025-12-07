'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { X, Phone, ArrowLeft } from 'lucide-react'

const PHONE_NUMBER = '+381637044428'
const PHONE_DISPLAY = '063 704 4428'

export default function ContactButton() {
  const t = useTranslations('Index.hero')
  const [isOpen, setIsOpen] = useState(false)

  const contactOptions = [
    {
      name: 'Viber',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.182.518 6.815.377 10.09c-.141 3.276-.263 9.418 5.753 11.07v2.538s-.038.977.607 1.177c.778.242 1.234-.502 1.978-1.304.407-.44.97-1.086 1.397-1.58 3.846.323 6.802-.416 7.14-.526.78-.254 5.19-.817 5.91-6.672.745-6.04-.355-9.854-2.347-11.575l.002-.001C19.476 2.03 15.03-.044 11.398.002zm.597 1.762c3.18-.023 7.086 1.603 8.24 2.606 1.627 1.404 2.53 4.737 1.903 9.7-.564 4.57-3.94 5.186-4.583 5.396-.277.09-2.905.752-6.161.537 0 0-2.44 2.942-3.203 3.705-.119.12-.26.166-.352.144-.129-.032-.165-.185-.163-.408l.024-4.013c-4.94-1.35-4.658-6.45-4.545-9.148.113-2.698.725-4.89 2.142-6.294 1.842-1.728 5.504-2.204 6.698-2.225zm.112 2.692c-.12.002-.12.18 0 .182 2.612.093 4.952 1.56 5.237 5.169.011.138.192.138.182 0-.2-3.828-2.822-5.261-5.42-5.351zm-3.5.63c-.212-.008-.467.09-.721.335l-.001.002c-.397.37-.776.867-.742 1.388.015.262.106.533.291.844l.002.004c.572 1.044 1.349 2.026 2.26 2.927l.006.006.006.006c.902.91 1.883 1.687 2.927 2.26l.004.001c.312.186.582.277.844.292.521.034 1.018-.345 1.389-.742l.001-.002c.248-.253.345-.51.335-.72-.012-.262-.177-.507-.443-.73-.536-.427-1.14-.785-1.474-1.018-.363-.252-.822-.223-1.106.063l-.535.538c-.263.248-.67.207-.67.207s-1.633-.393-2.88-1.64c-1.248-1.248-1.641-2.88-1.641-2.88s-.04-.409.207-.671l.538-.536c.287-.285.316-.743.064-1.107-.234-.333-.592-.938-1.019-1.474-.222-.265-.467-.43-.729-.442a.863.863 0 00-.113-.01zm3.256.893c-.12 0-.126.178-.004.183 1.658.075 3.163 1.12 3.243 3.317.004.12.182.114.18-.006-.108-2.37-1.789-3.42-3.42-3.494zm-.027 1.473c-.118-.003-.127.163-.008.175.986.097 1.59.603 1.678 1.79.008.118.183.108.177-.01-.086-1.335-.805-1.866-1.847-1.955z"/>
        </svg>
      ),
      color: 'bg-[#7360F2] hover:bg-[#5d4cc7]',
      href: `viber://chat?number=${PHONE_NUMBER.replace('+', '%2B')}`
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      color: 'bg-[#25D366] hover:bg-[#1da851]',
      href: `https://wa.me/${PHONE_NUMBER.replace('+', '')}`
    },
    {
      name: t('contactModal.call'),
      icon: <Phone className="w-6 h-6" />,
      color: 'bg-amber-500 hover:bg-amber-400',
      href: `tel:${PHONE_NUMBER}`
    }
  ]

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-10 py-5 bg-white/5 text-white rounded-full font-semibold text-sm uppercase tracking-widest border border-white/20 hover:bg-white/10 hover:border-amber-500/50 transition-all duration-500"
      >
        {t('ctaContact')}
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
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl p-8 z-50 shadow-2xl shadow-amber-500/10"
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
                  <Phone className="w-8 h-8 text-amber-500" />
                </div>

                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  {t('contactModal.title')}
                </h3>
                
                <p className="text-neutral-400 mb-2">
                  {t('contactModal.description')}
                </p>

                <p className="text-2xl font-bold text-amber-500 mb-8">
                  {PHONE_DISPLAY}
                </p>

                <div className="w-full space-y-3">
                  {contactOptions.map((option) => (
                    <a
                      key={option.name}
                      href={option.href}
                      className={`flex items-center justify-center gap-3 w-full py-4 ${option.color} text-white rounded-xl font-semibold transition-colors`}
                    >
                      {option.icon}
                      <span>{option.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
