import { useEffect, useRef } from "react"

export function AudioWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let phase = 0

    const draw = () => {
      const width = canvas.width
      const height = canvas.height
      const centerY = height / 2
      const bars = 60
      const barWidth = 4
      const gap = 8
      const totalWidth = bars * (barWidth + gap)
      const startX = (width - totalWidth) / 2

      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < bars; i++) {
        const x = startX + i * (barWidth + gap)

        const wave1 = Math.sin((i * 0.5) + phase) * 0.5 + 0.5
        const wave2 = Math.sin((i * 0.3) + phase * 1.3) * 0.3 + 0.5
        const wave3 = Math.sin((i * 0.7) + phase * 0.8) * 0.2 + 0.5
        const amplitude = (wave1 + wave2 + wave3) / 3

        const barHeight = 10 + amplitude * 100

        const gradient = ctx.createLinearGradient(x, centerY - barHeight/2, x, centerY + barHeight/2)
        gradient.addColorStop(0, "#EF4444")
        gradient.addColorStop(0.5, "#F97316")
        gradient.addColorStop(1, "#FBBF24")

        ctx.fillStyle = gradient
        ctx.fillRect(x, centerY - barHeight/2, barWidth, barHeight)
      }

      phase += 0.05
      animationFrameId = requestAnimationFrame(draw)
    }

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    draw()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-24"
      aria-hidden="true"
    />
  )
}
