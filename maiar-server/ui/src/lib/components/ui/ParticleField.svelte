<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { theme } from '$lib/stores/theme'

  let canvas: HTMLCanvasElement
  let animFrame: number
  let particles: Array<{ x: number; y: number; vx: number; vy: number; alpha: number; size: number; sparkle: boolean; phase: number }> = []
  let frameCount = 0

  function init(w: number, h: number) {
    particles = Array.from({ length: 48 }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      size: Math.random() * 2 + 0.5,
      sparkle: i % 6 === 0,
      phase: Math.random() * Math.PI * 2
    }))
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, isDark: boolean) {
    ctx.clearRect(0, 0, w, h)
    const color = isDark ? '194, 130, 60' : '180, 110, 50'
    frameCount++

    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0) p.x = w
      if (p.x > w) p.x = 0
      if (p.y < 0) p.y = h
      if (p.y > h) p.y = 0

      let a = p.alpha
      let s = p.size

      if (p.sparkle) {
        a = p.alpha * (0.5 + 0.5 * Math.sin(frameCount * 0.04 + p.phase))
        s = 2.5 + 0.5 * Math.sin(frameCount * 0.03 + p.phase)
      }

      ctx.beginPath()
      ctx.arc(p.x, p.y, s, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${color}, ${a})`
      ctx.fill()
    }
  }

  onMount(() => {
    const ctx = canvas.getContext('2d')!
    const parent = canvas.parentElement!
    let w = parent.offsetWidth
    let h = parent.offsetHeight
    canvas.width = w
    canvas.height = h
    init(w, h)

    let isDark = true
    const unsub = theme.subscribe(t => { isDark = t === 'dark' })

    const loop = () => {
      draw(ctx, w, h, isDark)
      animFrame = requestAnimationFrame(loop)
    }
    loop()

    const ro = new ResizeObserver(entries => {
      w = entries[0].contentRect.width
      h = entries[0].contentRect.height
      canvas.width = w
      canvas.height = h
      init(w, h)
    })
    ro.observe(parent)

    return () => {
      cancelAnimationFrame(animFrame)
      ro.disconnect()
      unsub()
    }
  })
</script>

<canvas bind:this={canvas} class="absolute inset-0 pointer-events-none opacity-60" />
