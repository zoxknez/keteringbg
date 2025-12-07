'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react'

// Sve slike iz dishes foldera
const galleryImages = [
  '0-02-05-016c74c682c5465deb321b4093f7534b1da282bc92be9eff6ead78edeaca9793_a184e08294095dd8.jpg',
  '0-02-05-0918c8bb83656cddc322cec7087b9ddd465394ffaa43b757a64634b7b5d9a7d9_a043729f83b6ce4a.jpg',
  '0-02-05-0df67f164223c5b5d7faf9f5627467b645ac57dbdfe7dfe4e348ed1fd9c53d37_397bb445652cac0a.jpg',
  '0-02-05-18d9d3416b5947b6b1a36e9fe2c6a6327e52340e136afa2e37a815da7ae7c445_c63ece60e5eb2d59.jpg',
  '0-02-05-19d33f3a2448d39f89ff3e6430cff42b29ea72e7e53284f0b0784d1371541005_45ba8c30d640c44a.jpg',
  '0-02-05-1b8ef666f4850435643bfb884c941857dd2c0c7ac1a37403888bf8316b48055c_214445b07180eef7.jpg',
  '0-02-05-28ea2ba7be4319c0c9e19035f2e66cede0e5995ea9791486f0563cdf691bc877_fb523810b0543c13.jpg',
  '0-02-05-355a42b2b46de00d9c1a8100650bf9da19001720fa76ff2ac5f38262999d44ec_2d50f4eca4da3ee1.jpg',
  '0-02-05-3d2890ba5a89011b876d8b4aaace256d7727115c6b8d14d9e271a98462bdb501_35659f30dcb27ac.jpg',
  '0-02-05-3f905a126264e41b3bd534be067122604e87df38e01bfca7adec31e23249e098_2758dd947defea22.jpg',
  '0-02-05-415aec5b7194f029f1529635a3a03265e448f1dc0c52d649fc1e4accdf132f39_6dc17f4ed5235183.jpg',
  '0-02-05-42676f3dd08fa7aef2d74b0d13dffbdd54230f6c0a2aa521a0988e74f26980e1_dd22a6c429cf62bf.jpg',
  '0-02-05-45d225caa8a51dc98a5171a8d9197b990ee85d068b8110e97c159706fbce3c58_7106b34c22cd691e.jpg',
  '0-02-05-4873e86803ba440543b5e39740fe76bd771059e5f3b41bc06d10afd986bb3d99_c93028ed3080ef3d.jpg',
  '0-02-05-48ea1471f58b2da5005b889ab378e9ab1eddd2c04fb327ea299f4c2376cc2482_d896f444b39085c.jpg',
  '0-02-05-4a18efbac672ae3ad9ef563f0b4d7323e05d65ec616fa1e830a3182fe7ef00cb_7a30bd3e92565bd8.jpg',
  '0-02-05-4fbf7330644bac0bf211854d78b254f20994c675fe1721fdb99f0a0a7528a359_4dee3cc0e9630816.jpg',
  '0-02-05-52bf4f10671d768d161ce71c9fb6a9cbd3053a032ace94fbfa9ee653c430d12c_8116a6b594a0256a.jpg',
  '0-02-05-61e12fd45b6d69543e6b6071a2a3fccaf3f100140aa7a33e8f4dab4e7343b731_d6e88eec78bfd782.jpg',
  '0-02-05-665d75c9f78d5f5414a167d48d07dc0116cfdd335eb717958915631ae388cda6_deae5c8bf83e2240.jpg',
  '0-02-05-66bd926848810bd311f2f50f9914caa566ed0d7abd82d59a8180c1bb9962f5e6_1acdb3b11e6ef04f.jpg',
  '0-02-05-7cfc6371021b210c1ece1c710d3b82162b1733357d31374126fa1dcd2e6f2341_2deb96e84953de53.jpg',
  '0-02-05-7d98eeec833bff91fab5e702a5a1f5abc6c0bd9130a62f71edabd8058768afce_11eb15704f675d67.jpg',
  '0-02-05-870a581d57bbd9eb93acd0cf6af3416a67bf41cf284fc5b69745a9057ee52232_74a3ac5e58e11c6b.jpg',
  '0-02-05-980a97620e2229493ada8786e6415de8682c3735e7fa31fc9e330e0f792378f8_d8adedf92f3b4d7a.jpg',
  '0-02-05-9d2a9c27cd67d04ebcd2ed724ae7699eb1cca92d5b5cd4b3d9970c3a164ce1a9_d427b6ea0d8878d4.jpg',
  '0-02-05-a268cd53bff52cbab5546e938bf53cd7bd1529b6ae5f0acc3de4f380bd2bcb0c_a2f5ec708f37db2c.jpg',
  '0-02-05-ac928fd7fb8b5d72120236278d4fbeae64bd3c70d660033b499d673476782338_884787ccf347391a.jpg',
  '0-02-05-b509175cd166a06489e63b2c914a6a4ed7feb6079e071c8e940d1b4ad56a2800_d80c3ab24b94a339.jpg',
  '0-02-05-b6b921ef63c147248044624322e5c5d3c3b2e67adf6776c12808d6228b9b2f18_3b0eb11d091c6cca.jpg',
  '0-02-05-b7cbca785dd2c6f27a2d8f5202df80d4df5cea355164c57802df2871f0fd296f_209c27e74fbaf81d.jpg',
  '0-02-05-bd42aa24b893df77146709d87c14eff51ecf6a52626ae71d3b62d03134a6e98f_75614c491486d45e.jpg',
  '0-02-05-c1b0d35855df90f19e4b73c7c312635a33f1fabd4f646bb52614231309c32b97_21d294d9960afebe.jpg',
  '0-02-05-c221773d86fa080886087325eee7e5d8dbd1e70148801961378160a59444d5bd_b1f1f1478c8be20c.jpg',
  '0-02-05-cade5275a36a994625765df8d74beffa5671777aaaf5587b36a7361bf46f3e53_2b0d3f6d9163341d.jpg',
  '0-02-05-ccfb60ba58edf41ab34ce35d0c24170b144f6630db35ecbd160f003c0d0cb52d_603a594dd437841a.jpg',
  '0-02-05-d4c489421fe3b0f0bea0ca3125e2c10f30ec6cff3f3aea209c5803c70ab1b726_4e643fc9c16d462c.jpg',
  '0-02-05-dc2a6973c771e84d6b34e91e16b3364b68e97e1f7741dc5e0366c73a4955c8bd_7360d69d94ef9124.jpg',
  '0-02-05-df66532c683b6e1841d2d61ffe88ba138ce001c9cc027c51ab813ecf8842a52e_fb8dd3e3b14da827.jpg',
  '0-02-05-e827fe8546d7a8e6e56215e950071d906b1229cdf3c9afb8c914915cbe2a3df1_4cfe52472870ad04.jpg',
  '0-02-05-e837f65f184736db39615228f31455ecc446cb2d2ace33c0e904e77fecbfbfb3_f5b2f8835b293dd4.jpg',
  '0-02-05-ef0f59f80430d7ad856a638625d8b56748074ff5bfd68c23db256ca244b89dcc_16b4a97ad681559.jpg',
  '0-02-05-fe0926ed8e7c17b211323876c67b953f630cbcfa9f8042c5df44487769141b9c_2f2aafe05cb45216.jpg',
]

const videoFile = '0-02-05-4a09c720f20a4f3a44401e8d91662c0052ddda7eec391c0667f2d8cbae06d6b9_4dd2b7adaa005f24.mp4'

export default function FoodGallery() {
  const t = useTranslations('Gallery')
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage])

  // Swipe handlers
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) nextImage()
    if (isRightSwipe) prevImage()
  }

  // Auto scroll animation
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5

    const animate = () => {
      scrollPosition += scrollSpeed
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }
      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    // Pause on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationId)
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate)
    }

    scrollContainer.addEventListener('mouseenter', handleMouseEnter)
    scrollContainer.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter)
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  // Handle body scroll lock
  useEffect(() => {
    if (selectedImage !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [selectedImage])

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length)
    }
  }

  return (
    <section id="gallery" className="py-24 overflow-hidden relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
      
      <div className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 px-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-500"
          >
            {t('subtitle')}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif font-bold text-white mt-4"
          >
            {t('title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 max-w-2xl mx-auto mt-4"
          >
            {t('description')}
          </motion.p>
        </div>

        {/* Video Hero */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mb-16 px-6"
        >
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10 border border-white/10 group">
            <video
              ref={videoRef}
              src={`/dishes/${videoFile}`}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
              onClick={() => {
                if (videoRef.current) {
                  if (isVideoPlaying) {
                    videoRef.current.pause()
                  } else {
                    videoRef.current.play()
                  }
                  setIsVideoPlaying(!isVideoPlaying)
                }
              }}
            />
            
            {/* Play Button Overlay */}
            {!isVideoPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition-all duration-300 group-hover:bg-black/30"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.play()
                    setIsVideoPlaying(true)
                  }
                }}
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-24 h-24 rounded-full bg-amber-500 flex items-center justify-center shadow-xl shadow-amber-500/30"
                >
                  <Play className="w-10 h-10 text-black ml-1" fill="black" />
                </motion.div>
              </div>
            )}

            {/* Video Badge */}
            <div className="absolute top-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {t('video')}
            </div>
          </div>
        </motion.div>

        {/* Infinite Scroll Gallery - Row 1 */}
        <div 
          ref={scrollRef}
          className="flex gap-4 mb-4 overflow-hidden"
          style={{ width: '200%' }}
        >
          {[...galleryImages, ...galleryImages].map((img, index) => (
            <motion.div
              key={`row1-${index}`}
              className="relative flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden cursor-pointer group"
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => openLightbox(index % galleryImages.length)}
            >
              <Image
                src={`/dishes/${img}`}
                alt={`${t('dishAlt')} ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Static Grid - Featured Images */}
        <div className="max-w-7xl mx-auto px-6 mt-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.slice(0, 12).map((img, index) => (
              <motion.div
                key={`grid-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`relative rounded-2xl overflow-hidden cursor-pointer group ${
                  index === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-[4/3]'
                }`}
                whileHover={{ scale: 1.02 }}
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={`/dishes/${img}`}
                  alt={`${t('dishAlt')} ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Hover Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-amber-500/90 flex items-center justify-center">
                    <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button 
              onClick={() => openLightbox(0)}
              className="px-8 py-4 bg-white/5 hover:bg-amber-500 text-white hover:text-black border border-white/10 hover:border-amber-500 rounded-full font-semibold text-sm uppercase tracking-widest transition-all duration-300"
            >
              {t('viewAll')} ({galleryImages.length})
            </button>
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center touch-none"
              onClick={closeLightbox}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEndHandler}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-50"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Navigation */}
              <button
                onClick={(e) => { e.stopPropagation(); prevImage() }}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-amber-500 flex items-center justify-center transition-all duration-300 group z-50"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-black" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage() }}
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-amber-500 flex items-center justify-center transition-all duration-300 group z-50"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-black" />
              </button>

              {/* Image */}
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-5xl max-h-[85vh] w-full h-full m-6 pointer-events-none"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={`/dishes/${galleryImages[selectedImage]}`}
                  alt={`${t('dishAlt')} ${selectedImage + 1}`}
                  fill
                  className="object-contain pointer-events-auto"
                  draggable={false}
                />
              </motion.div>

              {/* Counter */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium">
                {selectedImage + 1} / {galleryImages.length}
              </div>

              {/* Thumbnails */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-2 px-4 no-scrollbar" onClick={(e) => e.stopPropagation()}>
                {galleryImages.map((img, index) => (
                  <button
                    key={`thumb-${index}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedImage(index) }}
                    className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all duration-300 ${
                      index === selectedImage ? 'ring-2 ring-amber-500 scale-110' : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={`/dishes/${img}`}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  )
}
