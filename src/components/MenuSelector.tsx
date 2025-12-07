'use client'

import { useState, useActionState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, ArrowLeft, ChevronDown, Plus, Minus, ShoppingCart } from 'lucide-react'
import { submitOrder } from '@/app/actions'
import Image from 'next/image'

type Dish = {
  id: string
  name: string
  category: string
  imageUrl: string | null
  description: string | null
  tags?: string[]
  isVegetarian?: boolean
  isVegan?: boolean
  isFasting?: boolean
}

type Menu = {
  id: string
  name: string
  dishCount: number
  price: number
  dishes: Dish[]
}

interface MenuSelectorProps {
  menus: Menu[]
}

const initialState = {
  success: false,
  message: '',
}

import { useTranslations, useLocale } from 'next-intl'

// Emoji za tagove jela
const tagEmojis: Record<string, string> = {
  PORK: '🐷',
  CHICKEN: '🐔',
  BEEF: '🐄',
  FISH: '🐟',
  VEGETARIAN: '🥬',
  VEGAN: '🌱',
  FASTING: '✝️'
}

export default function MenuSelector({ menus }: MenuSelectorProps) {
  const t = useTranslations('Menu')
  const tCheckout = useTranslations('Checkout')
  const locale = useLocale()
  
  // Koraci: 'cart' -> 'dishes' -> 'checkout'
  const [step, setStep] = useState<'cart' | 'dishes' | 'checkout'>('cart')
  
  // Narudžbine po meniju (količina porcija za svaki meni)
  const [menuPortions, setMenuPortions] = useState<Record<string, number>>({})
  
  // Izabrana jela po meniju
  const [menuDishes, setMenuDishes] = useState<Record<string, string[]>>({})
  
  // Trenutni meni za koji biramo jela
  const [currentMenuIndex, setCurrentMenuIndex] = useState(0)
  
  // Filter i kategorije
  const [activeFilter, setActiveFilter] = useState<string>('ALL')
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  
  const [state, formAction] = useActionState(submitOrder, initialState)

  // Meniji koji imaju porcije > 0
  const activeMenus = useMemo(() => {
    return menus.filter(menu => (menuPortions[menu.id] || 0) > 0)
  }, [menus, menuPortions])

  // Ukupna cena
  const totalPrice = useMemo(() => {
    return menus.reduce((sum, menu) => {
      const portions = menuPortions[menu.id] || 0
      return sum + (menu.price * portions)
    }, 0)
  }, [menus, menuPortions])

  // Ukupan broj porcija
  const totalPortions = useMemo(() => {
    return Object.values(menuPortions).reduce((sum, p) => sum + p, 0)
  }, [menuPortions])

  // Trenutni meni za biranje jela
  const currentMenu = activeMenus[currentMenuIndex]

  const updatePortions = (menuId: string, delta: number) => {
    setMenuPortions(prev => {
      const current = prev[menuId] || 0
      const newValue = Math.max(0, current + delta)
      if (newValue === 0) {
        setMenuDishes(prevDishes => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [menuId]: _removed, ...rest } = prevDishes
          return rest
        })
      }
      return { ...prev, [menuId]: newValue }
    })
  }

  const setPortionsDirectly = (menuId: string, value: number) => {
    const newValue = Math.max(0, value)
    setMenuPortions(prev => ({ ...prev, [menuId]: newValue }))
    if (newValue === 0) {
      setMenuDishes(prevDishes => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [menuId]: _removed, ...rest } = prevDishes
        return rest
      })
    }
  }

  const toggleDish = (menuId: string, dishId: string, maxDishes: number) => {
    setMenuDishes(prev => {
      const current = prev[menuId] || []
      if (current.includes(dishId)) {
        return { ...prev, [menuId]: current.filter(id => id !== dishId) }
      } else if (current.length < maxDishes) {
        return { ...prev, [menuId]: [...current, dishId] }
      }
      return prev
    })
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const goToNextMenu = () => {
    if (currentMenuIndex < activeMenus.length - 1) {
      setCurrentMenuIndex(prev => prev + 1)
      setActiveFilter('ALL')
      setExpandedCategories([])
    } else {
      setStep('checkout')
    }
  }

  const goToPrevMenu = () => {
    if (currentMenuIndex > 0) {
      setCurrentMenuIndex(prev => prev - 1)
      setActiveFilter('ALL')
      setExpandedCategories([])
    } else {
      setStep('cart')
    }
  }

  const startDishSelection = () => {
    if (activeMenus.length > 0) {
      setCurrentMenuIndex(0)
      setStep('dishes')
      setActiveFilter('ALL')
      setExpandedCategories([])
    }
  }

  // Trenutna jela za meni
  const currentDishes = useMemo(() => currentMenu?.dishes || [], [currentMenu?.dishes])
  const currentSelectedDishes = currentMenu ? (menuDishes[currentMenu.id] || []) : []

  // Grupisanje jela po tipu mesa/ishrane
  const groupedByMeat = useMemo(() => ({
    CHICKEN: currentDishes.filter(d => d.tags?.includes('CHICKEN') && !d.tags?.includes('PORK') && !d.tags?.includes('BEEF')),
    PORK: currentDishes.filter(d => d.tags?.includes('PORK') && !d.tags?.includes('CHICKEN') && !d.tags?.includes('BEEF')),
    BEEF: currentDishes.filter(d => d.tags?.includes('BEEF') && !d.tags?.includes('PORK') && !d.tags?.includes('CHICKEN')),
    MIXED: currentDishes.filter(d => {
      const tags = d.tags || []
      const meatTags = tags.filter(t => ['PORK', 'CHICKEN', 'BEEF'].includes(t))
      return meatTags.length > 1
    }),
    FISH: currentDishes.filter(d => d.tags?.includes('FISH')),
    FASTING: currentDishes.filter(d => d.isFasting && !d.tags?.includes('FISH')),
  }), [currentDishes])

  // Kategorije sa ikonama i bojama
  const categoryConfig: Record<string, { icon: string; label: string; color: string; bgColor: string }> = {
    CHICKEN: { icon: '🐔', label: t('categories.CHICKEN'), color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
    PORK: { icon: '🐷', label: t('categories.PORK'), color: 'text-pink-400', bgColor: 'bg-pink-500/10' },
    BEEF: { icon: '🐄', label: t('categories.BEEF'), color: 'text-red-400', bgColor: 'bg-red-500/10' },
    MIXED: { icon: '🍖', label: t('categories.MIXED'), color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
    FISH: { icon: '🐟', label: t('categories.FISH'), color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    FASTING: { icon: '🌱', label: t('categories.FASTING'), color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  }

  // Pripremi podatke za slanje
  const prepareOrderData = () => {
    const orders = activeMenus.map(menu => ({
      menuId: menu.id,
      menuName: menu.name,
      portions: menuPortions[menu.id] || 0,
      pricePerPortion: menu.price,
      totalPrice: (menuPortions[menu.id] || 0) * menu.price,
      dishCount: menu.dishCount,
      selectedDishIds: menuDishes[menu.id] || []
    }))
    return {
      orders,
      totalPrice,
      totalPortions
    }
  }

  return (
    <div className="w-full">
      <AnimatePresence>
        {state.success && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-neutral-900 border border-white/10 p-8 md:p-12 rounded-3xl text-center max-w-lg w-full shadow-2xl shadow-amber-500/20 relative"
            >
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                <Check className="w-12 h-12 text-emerald-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">{tCheckout('successTitle')}</h2>
              <p className="text-neutral-400 text-lg mb-10 leading-relaxed">{tCheckout('successMessage')}</p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full py-4 bg-amber-500 text-black hover:bg-amber-400 rounded-xl font-semibold text-sm uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
                >
                  {tCheckout('newOrder')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* KORAK 1: Izbor količine po meniju */}
        {step === 'cart' && (
          <motion.div 
            key="cart"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {/* Meniji */}
            <div className="grid md:grid-cols-3 gap-6">
              {menus.map((menu, index) => {
                const portions = menuPortions[menu.id] || 0
                const menuTotal = menu.price * portions
                
                return (
                  <motion.div 
                    key={menu.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={`group relative bg-neutral-900/60 backdrop-blur rounded-3xl p-8 overflow-hidden border transition-all duration-500 ${portions > 0 ? 'border-amber-500/50 ring-2 ring-amber-500/20' : 'border-white/5 hover:border-white/20'}`}
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-6">
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
                    <div className="space-y-4">
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-white">
                        {menu.name}
                      </h3>
                      
                      {/* Info */}
                      <p className="text-neutral-500 leading-relaxed text-sm">
                        {t(`menuDetails.menu${index + 1}`)}
                      </p>

                      {/* Cena po porciji */}
                      <div className="flex items-baseline gap-1 pb-4 border-b border-white/10">
                        <span className="text-4xl font-serif font-bold text-amber-500">{menu.price}</span>
                        <span className="text-lg font-medium text-neutral-500">{t('units.rsd')}</span>
                        <span className="text-sm text-neutral-600 ml-2">{t('units.portion')}</span>
                      </div>

                      {/* Količina */}
                      <div className="space-y-3 pt-2">
                        <label className="text-sm font-semibold text-neutral-400">{tCheckout('portions')}</label>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updatePortions(menu.id, -1)}
                            disabled={portions === 0}
                            className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-5 h-5 text-white" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={portions}
                            onChange={(e) => setPortionsDirectly(menu.id, parseInt(e.target.value) || 0)}
                            className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl text-center text-2xl font-bold text-white focus:border-amber-500 focus:outline-none"
                          />
                          <button 
                            onClick={() => updatePortions(menu.id, 1)}
                            className="w-12 h-12 rounded-xl bg-amber-500 hover:bg-amber-400 flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-5 h-5 text-black" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      {portions > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pt-4 border-t border-white/10"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-400">{tCheckout('subtotal')}:</span>
                            <span className="text-2xl font-bold text-amber-400">{menuTotal.toLocaleString()} {t('units.rsd')}</span>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Decorative */}
                    {portions > 0 && (
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-amber-500/30 to-amber-500/10 rounded-full blur-2xl" />
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Total i dugme za nastavak */}
            {totalPortions > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky bottom-4 z-40"
              >
                <div className="bg-neutral-900/95 backdrop-blur-xl rounded-2xl border border-amber-500/30 p-6 max-w-2xl mx-auto shadow-2xl shadow-amber-500/10">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <p className="text-neutral-400 text-sm">{tCheckout('totalOrder')}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">{totalPrice.toLocaleString()}</span>
                        <span className="text-amber-500 font-medium">{t('units.rsd')}</span>
                      </div>
                      <p className="text-neutral-500 text-xs mt-1">{totalPortions} {tCheckout('portionsTotal')}</p>
                    </div>
                    <button 
                      onClick={startDishSelection}
                      className="w-full sm:w-auto px-8 py-4 bg-amber-500 text-black rounded-xl font-semibold uppercase tracking-widest hover:bg-amber-400 transition-all flex items-center justify-center gap-3"
                    >
                      {t('chooseDishes')}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* KORAK 2: Izbor jela za svaki meni */}
        {step === 'dishes' && currentMenu && (
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
              <div className="px-6 py-4">
                {/* Progress */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  {activeMenus.map((menu, idx) => (
                    <div 
                      key={menu.id}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx < currentMenuIndex ? 'bg-emerald-500 w-8' :
                        idx === currentMenuIndex ? 'bg-amber-500 w-12' : 'bg-neutral-700 w-8'
                      }`}
                    />
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <button onClick={goToPrevMenu} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 text-neutral-400 group-hover:text-black transition-all duration-300">
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-neutral-500 group-hover:text-white transition-colors hidden sm:block">
                      {t('back')}
                    </span>
                  </button>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-1">
                      {currentMenu.name} ({menuPortions[currentMenu.id]} {tCheckout('portions').toLowerCase()})
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {Array.from({ length: currentMenu.dishCount }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i < currentSelectedDishes.length ? 'bg-amber-500' : 'bg-neutral-700'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-white">
                        {currentSelectedDishes.length}/{currentMenu.dishCount}
                      </span>
                    </div>
                  </div>

                  <button 
                    disabled={currentSelectedDishes.length !== currentMenu.dishCount}
                    onClick={goToNextMenu}
                    className="px-6 py-3 bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-semibold text-sm transition-all duration-300"
                  >
                    {currentMenuIndex < activeMenus.length - 1 ? t('next') : tCheckout('continue')}
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 pb-4">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === 'ALL' 
                    ? 'bg-amber-500 text-black' 
                    : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                🍽️ {t('filters.all')}
              </button>
              {Object.entries(categoryConfig).map(([key, config]) => {
                const count = groupedByMeat[key as keyof typeof groupedByMeat]?.length || 0
                if (count === 0) return null
                return (
                  <button
                    key={key}
                    onClick={() => setActiveFilter(key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      activeFilter === key 
                        ? `${config.bgColor} ${config.color} ring-2 ring-current` 
                        : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{config.icon}</span>
                    <span className="hidden sm:inline">{config.label}</span>
                    <span className="text-xs opacity-60">({count})</span>
                  </button>
                )
              })}
            </div>

            {/* Dishes Grid */}
            <div className="space-y-4">
              {Object.entries(groupedByMeat).map(([category, categoryDishes]) => {
                if (categoryDishes.length === 0) return null
                if (activeFilter !== 'ALL' && activeFilter !== category) return null
                const config = categoryConfig[category]
                const isExpanded = expandedCategories.includes(category)
                const selectedInCategory = categoryDishes.filter(d => currentSelectedDishes.includes(d.id)).length
                
                return (
                  <div key={category} className="space-y-4">
                    {/* Category Header */}
                    <button 
                      onClick={() => toggleCategory(category)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl ${config.bgColor} border border-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer group`}
                    >
                      <div className={`w-14 h-14 rounded-xl ${config.bgColor} flex items-center justify-center text-3xl transition-transform duration-300 ${isExpanded ? 'scale-110' : ''}`}>
                        {config.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className={`text-xl font-serif font-bold ${config.color} flex items-center gap-2`}>
                          {config.label}
                          {selectedInCategory > 0 && (
                            <span className="px-2 py-0.5 bg-amber-500 text-black text-xs font-bold rounded-full">
                              {selectedInCategory} {t('selected')}
                            </span>
                          )}
                        </h3>
                        <p className="text-neutral-500 text-sm">{categoryDishes.length} {t('dishes')} {t('available')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="hidden sm:block text-neutral-600 text-sm">
                          {isExpanded ? t('close') : t('open')}
                        </span>
                        <div className={`w-10 h-10 rounded-full ${isExpanded ? 'bg-amber-500 text-black' : 'bg-white/10 text-white'} flex items-center justify-center transition-all duration-300`}>
                          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </button>
                    
                    {/* Collapsible Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
                            {categoryDishes.map((dish) => (
                              <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                key={dish.id}
                                onClick={() => toggleDish(currentMenu.id, dish.id, currentMenu.dishCount)}
                                className={`group cursor-pointer bg-neutral-900/60 backdrop-blur rounded-2xl overflow-hidden transition-all duration-300 border-2 ${currentSelectedDishes.includes(dish.id) ? 'border-amber-500' : 'border-white/5 hover:border-white/10'}`}
                              >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                  <Image 
                                    src={dish.imageUrl || ''} 
                                    alt={dish.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                  
                                  {/* Tags */}
                                  {dish.tags && dish.tags.length > 0 && (
                                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                                      {dish.tags.map((tag) => (
                                        <span 
                                          key={tag} 
                                          className="px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs font-medium text-white flex items-center gap-1"
                                          title={t(`tags.${tag}`)}
                                        >
                                          <span>{tagEmojis[tag] || '🍽️'}</span>
                                        </span>
                                      ))}
                                      {dish.isFasting && !dish.tags.includes('FASTING') && (
                                        <span 
                                          className="px-2 py-1 bg-emerald-600/80 backdrop-blur-sm rounded-full text-xs font-medium text-white flex items-center gap-1"
                                          title={t('tags.FASTING')}
                                        >
                                          <span>✝️</span>
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  
                                  {/* Selection Badge */}
                                  <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${currentSelectedDishes.includes(dish.id) ? 'bg-amber-500 scale-100' : 'bg-black/80 scale-0 group-hover:scale-100'}`}>
                                    <Check className={`w-4 h-4 ${currentSelectedDishes.includes(dish.id) ? 'text-black' : 'text-neutral-400'}`} />
                                  </div>
                                </div>

                                <div className="p-4">
                                  <h4 className={`font-bold text-lg transition-colors duration-300 ${currentSelectedDishes.includes(dish.id) ? 'text-amber-400' : 'text-white'}`}>
                                    {dish.name}
                                  </h4>
                                  <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                                    {dish.description || t('dishDescription')}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* KORAK 3: Checkout */}
        {step === 'checkout' && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-neutral-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden">
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
              
              <button onClick={() => { setStep('dishes'); setCurrentMenuIndex(activeMenus.length - 1); }} className="flex items-center gap-3 group mb-8">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 text-slate-400 group-hover:text-slate-900 transition-all duration-300">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-neutral-500 group-hover:text-white transition-colors">
                  {tCheckout('changeDishes')}
                </span>
              </button>

              {/* Rezime porudžbine */}
              <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-amber-500" />
                  {tCheckout('orderSummary')}
                </h3>
                
                <div className="space-y-4">
                  {activeMenus.map((menu) => {
                    const portions = menuPortions[menu.id] || 0
                    const dishes = menuDishes[menu.id] || []
                    const menuPrice = menu.price * portions
                    
                    return (
                      <div key={menu.id} className="pb-4 border-b border-white/10 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-white">{menu.name}</h4>
                            <p className="text-sm text-neutral-500">{portions} × {menu.price} {t('units.rsd')}</p>
                          </div>
                          <span className="text-lg font-bold text-amber-400">{menuPrice.toLocaleString()} {t('units.rsd')}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {dishes.map((dishId) => {
                            const dish = menu.dishes.find(d => d.id === dishId)
                            return dish ? (
                              <span key={dishId} className="px-2 py-1 bg-white/5 rounded text-xs text-neutral-400">
                                {dish.name}
                              </span>
                            ) : null
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-amber-500/30 flex justify-between items-center">
                  <span className="text-lg font-bold text-white">{tCheckout('total')}:</span>
                  <span className="text-2xl font-bold text-amber-500">{totalPrice.toLocaleString()} {t('units.rsd')}</span>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">{tCheckout('title')}</h2>
                <p className="text-neutral-500">{tCheckout('disclaimer')}</p>
              </div>
              
              <form action={formAction} className="space-y-6">
                <input type="hidden" name="orderData" value={JSON.stringify(prepareOrderData())} />
                <input type="hidden" name="locale" value={locale} />
                
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

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">{tCheckout('address')}</label>
                    <input 
                      required 
                      name="address" 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-300 placeholder:text-neutral-700"
                      placeholder="Ulica i broj, Grad"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">{tCheckout('dateTime')}</label>
                    <input 
                      required 
                      name="eventDate" 
                      type="datetime-local" 
                      min={new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-300 placeholder:text-neutral-700 [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-2">{tCheckout('note')}</label>
                  <textarea 
                    name="message" 
                    rows={4} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-300 placeholder:text-neutral-700 resize-none"
                    placeholder="..."
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
