'use client'

import { useState, useActionState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, ArrowLeft, Utensils } from 'lucide-react'
import { submitOrder } from '@/app/actions'
import Image from 'next/image'

type Dish = {
  id: string
  name: string
  category: string
  imageUrl: string | null
  description: string | null
}

type Menu = {
  id: string
  name: string
  dishCount: number
  price: any
  dishes: Dish[]
}

interface MenuSelectorProps {
  menus: Menu[]
}

const initialState = {
  success: false,
  message: '',
}

import { useTranslations } from 'next-intl'

export default function MenuSelector({ menus }: MenuSelectorProps) {
  const t = useTranslations('Menu')
  const tCheckout = useTranslations('Checkout')
  const [step, setStep] = useState<'menu' | 'dishes' | 'checkout'>('menu')
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
  const [selectedDishIds, setSelectedDishIds] = useState<string[]>([])
  
  const [state, formAction] = useActionState(submitOrder, initialState)

  const handleMenuSelect = (menu: Menu) => {
    setSelectedMenu(menu)
    setStep('dishes')
    setSelectedDishIds([])
  }

  const toggleDish = (dishId: string) => {
    if (selectedDishIds.includes(dishId)) {
      setSelectedDishIds(prev => prev.filter(id => id !== dishId))
    } else {
      if (selectedMenu && selectedDishIds.length < selectedMenu.dishCount) {
        setSelectedDishIds(prev => [...prev, dishId])
      }
    }
  }

  const currentDishes = selectedMenu ? selectedMenu.dishes : []

  const groupedDishes = {
    APPETIZER: currentDishes.filter(d => d.category === 'APPETIZER'),
    MAIN: currentDishes.filter(d => d.category === 'MAIN'),
    DESSERT: currentDishes.filter(d => d.category === 'DESSERT'),
  }

  if (state.success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-neutral-900/80 backdrop-blur-xl p-16 rounded-3xl text-center max-w-lg mx-auto border border-white/10"
      >
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <Check className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-white mb-4">{tCheckout('successTitle')}</h2>
        <p className="text-slate-400 text-lg mb-8">{tCheckout('successMessage')}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-amber-500 text-black hover:bg-amber-400 rounded-full font-semibold text-sm uppercase tracking-widest transition-all duration-300"
        >
          {tCheckout('newOrder')}
        </button>
      </motion.div>
    )
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {step === 'menu' && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid md:grid-cols-3 gap-6"
          >
            {menus.map((menu, index) => (
              <motion.div 
                key={menu.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => handleMenuSelect(menu)}
                className="group relative bg-neutral-900/60 backdrop-blur rounded-3xl p-8 md:p-10 cursor-pointer overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Badge */}
                <div className="flex items-center justify-between mb-8">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-xs font-bold uppercase tracking-widest text-neutral-500">
                    <span className="w-2 h-2 bg-amber-500 rounded-full" />
                    {t('menuLabel')} {index + 1}
                  </span>
                  {index === 1 && (
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-full">
                      {t('popular')}
                    </span>
                  )}
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-white group-hover:text-amber-400 transition-colors duration-300">
                    {menu.name}
                  </h3>
                  
                  <div className="flex items-end gap-2">
                    <span className="text-7xl font-serif font-bold text-white">{menu.dishCount}</span>
                    <span className="text-lg font-medium text-neutral-600 pb-3">{t('dishesChoice')}</span>
                  </div>

                  <p className="text-neutral-500 leading-relaxed">
                    {t('description')}
                  </p>

                  <div className="pt-4">
                    <button className="w-full py-4 bg-amber-500 text-black rounded-2xl font-semibold text-sm uppercase tracking-widest group-hover:bg-amber-400 transition-all duration-300 flex items-center justify-center gap-3">
                      {t('select')}
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Decorative */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-amber-500/30 to-amber-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
              </motion.div>
            ))}
          </motion.div>
        )}

        {step === 'dishes' && selectedMenu && (
          <motion.div
            key="dishes"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Sticky Header */}
            <div className="sticky top-4 z-40 bg-neutral-900/90 backdrop-blur-xl rounded-2xl border border-white/10 mx-auto max-w-4xl">
              <div className="px-6 py-4 flex items-center justify-between">
                <button onClick={() => setStep('menu')} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 text-neutral-400 group-hover:text-black transition-all duration-300">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-neutral-500 group-hover:text-white transition-colors hidden sm:block">
                    {t('back')}
                  </span>
                </button>

                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-1">
                    {selectedMenu.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {Array.from({ length: selectedMenu.dishCount }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${i < selectedDishIds.length ? 'bg-amber-500' : 'bg-neutral-700'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-white">
                      {selectedDishIds.length}/{selectedMenu.dishCount}
                    </span>
                  </div>
                </div>

                <button 
                  disabled={selectedDishIds.length !== selectedMenu.dishCount}
                  onClick={() => setStep('checkout')}
                  className="px-6 py-3 bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-semibold text-sm transition-all duration-300"
                >
                  {t('next')}
                </button>
              </div>
            </div>

            {/* Dishes Grid */}
            <div className="space-y-16">
              {Object.entries(groupedDishes).map(([category, categoryDishes]) => {
                if (categoryDishes.length === 0) return null
                return (
                <div key={category} className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <Utensils className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-white">
                        {category === 'APPETIZER' ? t('appetizers') : category === 'MAIN' ? t('mains') : t('desserts')}
                      </h3>
                      <p className="text-neutral-600 text-sm">{t('chooseDishes')}</p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryDishes.map((dish) => (
                      <motion.div 
                        layout
                        key={dish.id}
                        onClick={() => toggleDish(dish.id)}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        className={`group cursor-pointer bg-neutral-900/60 backdrop-blur rounded-2xl overflow-hidden transition-all duration-300 border-2 ${selectedDishIds.includes(dish.id) ? 'border-amber-500' : 'border-white/5 hover:border-white/10'}`}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image 
                            src={dish.imageUrl || ''} 
                            alt={dish.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          
                          {/* Selection Badge */}
                          <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${selectedDishIds.includes(dish.id) ? 'bg-amber-500 scale-100' : 'bg-black/80 scale-0 group-hover:scale-100'}`}>
                            <Check className={`w-4 h-4 ${selectedDishIds.includes(dish.id) ? 'text-black' : 'text-neutral-400'}`} />
                          </div>
                        </div>

                        <div className="p-4">
                          <h4 className={`font-bold text-lg transition-colors duration-300 ${selectedDishIds.includes(dish.id) ? 'text-amber-400' : 'text-white'}`}>
                            {dish.name}
                          </h4>
                          <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                            {dish.description || t('dishDescription')}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )})}
            </div>
          </motion.div>
        )}

        {step === 'checkout' && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-neutral-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden">
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
              
              <button onClick={() => setStep('dishes')} className="flex items-center gap-3 group mb-10">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 text-slate-400 group-hover:text-slate-900 transition-all duration-300">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-neutral-500 group-hover:text-white transition-colors">
                  {t('back')}
                </span>
              </button>
              
              <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">{tCheckout('title')}</h2>
                <p className="text-neutral-500">{tCheckout('disclaimer')}</p>
              </div>
              
              <form action={formAction} className="space-y-6">
                <input type="hidden" name="menuId" value={selectedMenu?.id} />
                <input type="hidden" name="selectedDishIds" value={JSON.stringify(selectedDishIds)} />
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">{tCheckout('name')}</label>
                    <input 
                      required 
                      name="clientName" 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-300 placeholder:text-neutral-700"
                      placeholder="Vaše ime i prezime"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">{tCheckout('phone')}</label>
                    <input 
                      required 
                      name="clientPhone" 
                      type="tel" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-300 placeholder:text-neutral-700"
                      placeholder="+381 6..."
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-2">{tCheckout('email')}</label>
                  <input 
                    required 
                    name="clientEmail" 
                    type="email" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-300 placeholder:text-neutral-700"
                    placeholder="vas@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-2">{tCheckout('note')}</label>
                  <textarea 
                    name="message" 
                    rows={4} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-300 placeholder:text-neutral-700 resize-none"
                    placeholder="Datum događaja, broj gostiju, posebne želje..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-amber-500 text-slate-900 hover:bg-amber-400 rounded-xl font-semibold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:shadow-amber-500/20"
                >
                  {tCheckout('submit')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
