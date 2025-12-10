'use client'

import { useState, useActionState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, ArrowLeft, ChevronDown, Plus, Minus, ShoppingCart, Trash2, X } from 'lucide-react'
import { submitOrder } from '@/app/actions'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { toast } from 'sonner'

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

// Stavka u porudžbini
interface OrderItem {
  id: string // unique id za stavku
  menuId: string
  menuName: string
  menuPrice: number
  dishCount: number
  selectedDishes: Dish[]
  portions: number
}

interface MenuSelectorProps {
  menus: Menu[]
}

const initialState = {
  success: false,
  message: '',
}

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
  const tOrder = useTranslations('Order')
  const locale = useLocale()
  
  // Koraci: menu -> dishes -> order -> checkout -> success
  const [step, setStep] = useState<'menu' | 'dishes' | 'order' | 'checkout' | 'success'>('menu')
  
  // Trenutno selektovani meni i jela
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
  const [selectedDishIds, setSelectedDishIds] = useState<string[]>([])
  const [currentPortions, setCurrentPortions] = useState<number>(1)
  
  // Porudžbina - lista stavki
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  
  // Modal za potvrdu nakon dodavanja
  const [showAddedModal, setShowAddedModal] = useState(false)
  
  // Filteri
  const [activeFilter, setActiveFilter] = useState<string>('ALL')
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  
  const [state, formAction] = useActionState(submitOrder, initialState)

  useEffect(() => {
    if (state.success) {
      setStep('success')
      setOrderItems([])
      toast.success(state.message)
    } else if (state.message) {
      toast.error(state.message)
    }
  }, [state])

  // Izračunaj ukupnu cenu porudžbine
  const totalPrice = orderItems.reduce((sum, item) => sum + (item.menuPrice * item.portions), 0)
  const totalPortions = orderItems.reduce((sum, item) => sum + item.portions, 0)

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleMenuSelect = (menu: Menu) => {
    setSelectedMenu(menu)
    setStep('dishes')
    setSelectedDishIds([])
    setCurrentPortions(1)
    setActiveFilter('ALL')
    setExpandedCategories([])
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

  // Dodaj u porudžbinu
  const addToOrder = () => {
    if (!selectedMenu || selectedDishIds.length !== selectedMenu.dishCount) return

    const selectedDishObjects = selectedMenu.dishes.filter(d => selectedDishIds.includes(d.id))
    
    const newItem: OrderItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      menuId: selectedMenu.id,
      menuName: selectedMenu.name,
      menuPrice: selectedMenu.price,
      dishCount: selectedMenu.dishCount,
      selectedDishes: selectedDishObjects,
      portions: currentPortions
    }

    setOrderItems(prev => [...prev, newItem])
    setShowAddedModal(true) // Prikaži modal umesto direktnog prelaska
    setSelectedMenu(null)
    setSelectedDishIds([])
    setCurrentPortions(1)
  }

  // Nastavi sa dodavanjem
  const continueOrdering = () => {
    setShowAddedModal(false)
    setStep('menu')
  }

  // Završi porudžbinu
  const finishOrdering = () => {
    setShowAddedModal(false)
    setStep('order')
  }

  // Obriši stavku iz porudžbine
  const removeOrderItem = (itemId: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId))
  }

  // Dodaj još jednu stavku
  const addMoreItems = () => {
    setStep('menu')
    setSelectedMenu(null)
    setSelectedDishIds([])
    setCurrentPortions(1)
  }

  const currentDishes = selectedMenu ? selectedMenu.dishes : []

  // Grupisanje jela po tipu mesa/ishrane
  const groupedByMeat = {
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
  }

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
    return {
      items: orderItems.map(item => ({
        menuId: item.menuId,
        menuName: item.menuName,
        menuPrice: item.menuPrice,
        portions: item.portions,
        totalPrice: item.menuPrice * item.portions,
        selectedDishIds: item.selectedDishes.map(d => d.id),
        selectedDishNames: item.selectedDishes.map(d => d.name)
      })),
      totalPrice,
      totalPortions
    }
  }

  return (
    <div className="w-full">
      {/* Floating Order Badge */}
      {orderItems.length > 0 && step !== 'order' && step !== 'checkout' && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setStep('order')}
          className="fixed bottom-6 right-6 z-50 bg-amber-500 text-black px-6 py-4 rounded-2xl shadow-2xl shadow-amber-500/30 flex items-center gap-3 hover:bg-amber-400 transition-all duration-300"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-bold">{tOrder('viewOrder')}</span>
          <span className="bg-black text-amber-500 px-2 py-1 rounded-lg text-sm font-bold">
            {orderItems.length}
          </span>
        </motion.button>
      )}

      <AnimatePresence>
        {state.success && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
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
              
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-amber-500 text-black hover:bg-amber-400 rounded-xl font-semibold text-sm uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
              >
                {tCheckout('newOrder')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal - Dodato u porudžbinu */}
      <AnimatePresence>
        {showAddedModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-neutral-900 border border-white/10 p-8 rounded-3xl text-center max-w-md w-full shadow-2xl shadow-amber-500/20 relative"
            >
              {/* Success icon */}
              <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/30">
                <Check className="w-10 h-10 text-amber-500" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                {tOrder('addedTitle')}
              </h2>
              <p className="text-neutral-400 mb-8 leading-relaxed">
                {tOrder('addedMessage')}
              </p>

              {/* Ukupno trenutno */}
              <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                <p className="text-neutral-500 text-sm mb-1">{tOrder('currentTotal')}</p>
                <p className="text-2xl font-bold text-amber-500">
                  {orderItems.length} {orderItems.length === 1 ? tOrder('item') : tOrder('items')} • {totalPrice.toLocaleString()} {t('units.rsd')}
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={continueOrdering}
                  className="w-full py-4 bg-white/10 text-white hover:bg-white/20 rounded-xl font-semibold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {tOrder('addMoreItems')}
                </button>
                <button 
                  onClick={finishOrdering}
                  className="w-full py-4 bg-amber-500 text-black hover:bg-amber-400 rounded-xl font-semibold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {tOrder('finishOrder')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* KORAK 1: Izbor menija */}
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
                  
                  {/* Cena */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-serif font-bold text-amber-500">{menu.price}</span>
                    <span className="text-lg font-medium text-neutral-500">{t('units.rsd')}</span>
                    <span className="text-sm text-neutral-600 ml-2">{t('units.portion')}</span>
                  </div>

                  <p className="text-neutral-500 leading-relaxed text-sm">
                    {t(`menuDetails.menu${index + 1}`)}
                  </p>

                  <div className="pt-4">
                    <button className="w-full py-4 bg-amber-500 text-black rounded-2xl font-semibold text-sm uppercase tracking-widest group-hover:bg-amber-400 transition-all duration-300 flex items-center justify-center gap-3">
                      {t('select')}
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Decorative */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-linear-to-br from-amber-500/30 to-amber-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* KORAK 2: Izbor jela + broj porcija */}
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
                <button onClick={() => setStep(orderItems.length > 0 ? 'order' : 'menu')} className="flex items-center gap-3 group">
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

                <div className="w-24" /> {/* Spacer */}
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
                const selectedInCategory = categoryDishes.filter(d => selectedDishIds.includes(d.id)).length
                
                return (
                <div key={category} className="space-y-4">
                  {/* Category Header - Clickable */}
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
                              onClick={() => toggleDish(dish.id)}
                              whileHover={{ y: -5 }}
                              whileTap={{ scale: 0.98 }}
                              className={`group cursor-pointer bg-neutral-900/60 backdrop-blur rounded-2xl overflow-hidden transition-all duration-300 border-2 ${selectedDishIds.includes(dish.id) ? 'border-amber-500' : 'border-white/5 hover:border-white/10'}`}
                            >
                              <div className="relative aspect-4/3 overflow-hidden">
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )})}
            </div>

            {/* Bottom Action Bar - Izbor porcija i dodavanje */}
            <AnimatePresence>
              {selectedDishIds.length === selectedMenu.dishCount && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-xl border-t border-white/10 p-4 md:p-6"
                >
                  <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
                    {/* Porcije kontrola */}
                    <div className="flex items-center gap-4 bg-white/5 rounded-xl px-4 py-3">
                      <span className="text-neutral-400 text-sm font-medium">{tOrder('portions')}:</span>
                      <button 
                        onClick={() => setCurrentPortions(Math.max(1, currentPortions - 1))}
                        className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-2xl font-bold text-white w-12 text-center">{currentPortions}</span>
                      <button 
                        onClick={() => setCurrentPortions(currentPortions + 1)}
                        className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Cena */}
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-neutral-500 text-sm">{tOrder('subtotal')}</p>
                      <p className="text-2xl font-bold text-amber-500">
                        {(selectedMenu.price * currentPortions).toLocaleString()} {t('units.rsd')}
                      </p>
                    </div>

                    {/* Dodaj dugme */}
                    <button
                      onClick={addToOrder}
                      className="w-full sm:w-auto px-8 py-4 bg-amber-500 text-black hover:bg-amber-400 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <Plus className="w-5 h-5" />
                      {tOrder('addToOrder')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* KORAK 3: Pregled porudžbine */}
        {step === 'order' && (
          <motion.div
            key="order"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-neutral-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-white/10 relative overflow-hidden">
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-amber-400 to-amber-600" />
              
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white flex items-center gap-3">
                  <ShoppingCart className="w-8 h-8 text-amber-500" />
                  {tOrder('title')}
                </h2>
                {orderItems.length > 0 && (
                  <span className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full text-sm font-bold">
                    {orderItems.length} {orderItems.length === 1 ? tOrder('item') : tOrder('items')}
                  </span>
                )}
              </div>

              {orderItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingCart className="w-10 h-10 text-neutral-600" />
                  </div>
                  <p className="text-neutral-500 mb-6">{tOrder('empty')}</p>
                  <button
                    onClick={() => setStep('menu')}
                    className="px-8 py-4 bg-amber-500 text-black hover:bg-amber-400 rounded-xl font-bold text-sm uppercase tracking-widest transition-all"
                  >
                    {tOrder('startOrdering')}
                  </button>
                </div>
              ) : (
                <>
                  {/* Lista stavki */}
                  <div className="space-y-4 mb-8">
                    {orderItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-2xl p-5 border border-white/10 group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-lg font-bold text-white">{item.menuName}</h4>
                            <p className="text-sm text-neutral-500">
                              {item.portions} × {item.menuPrice} {t('units.rsd')}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-bold text-amber-500">
                              {(item.menuPrice * item.portions).toLocaleString()} {t('units.rsd')}
                            </span>
                            <button
                              onClick={() => removeOrderItem(item.id)}
                              className="w-10 h-10 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 hover:text-red-300 transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Jela */}
                        <div className="flex flex-wrap gap-2">
                          {item.selectedDishes.map(dish => (
                            <span 
                              key={dish.id}
                              className="px-3 py-1 bg-white/5 rounded-lg text-sm text-neutral-400 flex items-center gap-1"
                            >
                              {dish.tags?.[0] && <span>{tagEmojis[dish.tags[0]]}</span>}
                              {dish.name}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Dodaj još */}
                  <button
                    onClick={addMoreItems}
                    className="w-full py-4 border-2 border-dashed border-white/20 hover:border-amber-500/50 rounded-2xl text-neutral-400 hover:text-amber-500 font-medium flex items-center justify-center gap-3 transition-all duration-300 mb-8"
                  >
                    <Plus className="w-5 h-5" />
                    {tOrder('addMore')}
                  </button>

                  {/* Ukupno */}
                  <div className="bg-linear-to-r from-amber-500/20 to-amber-600/20 rounded-2xl p-6 border border-amber-500/30 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-neutral-400">{tOrder('totalPortions')}:</span>
                      <span className="text-white font-bold">{totalPortions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl text-white font-medium">{tOrder('totalPrice')}:</span>
                      <span className="text-3xl font-bold text-amber-500">{totalPrice.toLocaleString()} {t('units.rsd')}</span>
                    </div>
                  </div>

                  {/* Nastavi na checkout */}
                  <button
                    onClick={() => setStep('checkout')}
                    className="w-full py-5 bg-amber-500 text-black hover:bg-amber-400 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-amber-500/20"
                  >
                    {tOrder('continue')}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* KORAK 4: Checkout */}
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
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-amber-400 to-amber-600" />
              
              <button onClick={() => setStep('order')} className="flex items-center gap-3 group mb-8">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 text-slate-400 group-hover:text-slate-900 transition-all duration-300">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-neutral-500 group-hover:text-white transition-colors">
                  {tOrder('backToOrder')}
                </span>
              </button>

              {/* Order Summary */}
              <div className="bg-white/5 rounded-2xl p-4 mb-8 border border-white/10">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-neutral-500 text-sm">{tOrder('orderSummary')}</p>
                    <p className="text-white font-medium">{orderItems.length} {orderItems.length === 1 ? tOrder('item') : tOrder('items')}, {totalPortions} {tOrder('portionsLabel')}</p>
                  </div>
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
                      placeholder={tCheckout('namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">{tCheckout('phone')}</label>
                    <input 
                      required 
                      name="clientPhone" 
                      type="tel" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-300 placeholder:text-neutral-700"
                      placeholder={tCheckout('phonePlaceholder')}
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
                    placeholder={tCheckout('emailPlaceholder')}
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
                      placeholder={tCheckout('addressPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">{tCheckout('dateTime')}</label>
                    <input 
                      required 
                      name="eventDate" 
                      type="datetime-local" 
                      min={new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-300 placeholder:text-neutral-700 scheme-dark"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-2">{tCheckout('note')}</label>
                  <textarea 
                    name="message" 
                    rows={4} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-300 placeholder:text-neutral-700 resize-none"
                    placeholder={tCheckout('notePlaceholder')}
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
        {/* KORAK 5: Success */}
        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-neutral-900/80 backdrop-blur-xl rounded-3xl p-12 border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-green-400 to-green-600" />
              
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Check className="w-12 h-12 text-green-500" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                {tCheckout('successTitle') || 'Hvala vam!'}
              </h2>
              <p className="text-neutral-400 text-lg mb-8">
                {tCheckout('successMessage') || 'Vaša porudžbina je uspešno primljena. Poslali smo vam email sa detaljima.'}
              </p>
              
              <button
                onClick={() => setStep('menu')}
                className="px-8 py-4 bg-amber-500 text-black hover:bg-amber-400 rounded-xl font-bold text-sm uppercase tracking-widest transition-all"
              >
                {tOrder('startOrdering')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
