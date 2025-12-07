'use client'

import { useEffect, useRef, useState } from 'react'

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let mouseX = 0
    let mouseY = 0

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Track mouse
    const handleMouse = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener('mousemove', handleMouse)

    // Stars
    interface Star {
      x: number
      y: number
      size: number
      speed: number
      brightness: number
      twinkleSpeed: number
      twinkleOffset: number
    }

    const stars: Star[] = []
    const starCount = 120

    // Initialize stars with seeded positions
    for (let i = 0; i < starCount; i++) {
      const seed = i * 9999
      const rand = (s: number) => {
        const x = Math.sin(s) * 10000
        return x - Math.floor(x)
      }
      
      stars.push({
        x: rand(seed) * canvas.width,
        y: rand(seed + 1) * canvas.height,
        size: rand(seed + 2) * 2 + 0.5,
        speed: rand(seed + 3) * 0.5 + 0.1,
        brightness: rand(seed + 4),
        twinkleSpeed: rand(seed + 5) * 0.02 + 0.01,
        twinkleOffset: rand(seed + 6) * Math.PI * 2
      })
    }

    // Golden particles
    interface Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
    }

    const particles: Particle[] = []
    const particleCount = 25

    for (let i = 0; i < particleCount; i++) {
      const seed = i * 7777
      const rand = (s: number) => {
        const x = Math.sin(s) * 10000
        return x - Math.floor(x)
      }
      
      particles.push({
        x: rand(seed) * canvas.width,
        y: rand(seed + 1) * canvas.height,
        size: rand(seed + 2) * 3 + 1,
        speedX: (rand(seed + 3) - 0.5) * 0.3,
        speedY: (rand(seed + 4) - 0.5) * 0.3,
        opacity: rand(seed + 5) * 0.5 + 0.2
      })
    }

    let time = 0

    const animate = () => {
      time += 0.016
      
      // Clear with black
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Subtle radial gradient overlay
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.8
      )
      gradient.addColorStop(0, 'rgba(20, 20, 35, 0.3)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Mouse glow
      const mouseGlow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 200)
      mouseGlow.addColorStop(0, 'rgba(245, 158, 11, 0.03)')
      mouseGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = mouseGlow
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.5 + 0.5
        const alpha = star.brightness * twinkle * 0.8 + 0.1
        
        // Star glow
        const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3)
        glow.addColorStop(0, `rgba(255, 250, 240, ${alpha})`)
        glow.addColorStop(0.5, `rgba(255, 245, 220, ${alpha * 0.3})`)
        glow.addColorStop(1, 'rgba(255, 240, 200, 0)')
        
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()
        
        // Star core
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.fill()
      })

      // Draw golden particles
      particles.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY

        // Wrap around
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        const pulse = Math.sin(time * 2 + p.x * 0.01) * 0.3 + 0.7
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(245, 158, 11, ${p.opacity * pulse})`
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [mounted])

  return (
    <div className="fixed inset-0 -z-10 bg-black">
      {mounted && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
      )}
    </div>
  )
}
