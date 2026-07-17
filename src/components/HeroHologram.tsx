import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { Theme } from '@/hooks/useTheme'

const SAMPLE_SIZE = 360 // px grid the photo is sampled on
const ROW_STEP = 2 // scan-line spacing
const COL_STEP = 2 // sample spacing along a scan line
const CROP = 0.68 // fraction of the photo kept (zooms in on the head)
const BG_TOLERANCE = 30 // flood-fill color distance for background removal
const DEPTH_DOME = 58 // face-dome extrusion strength
const DEPTH_LUMA = 34 // luminance extrusion strength
const WORLD_HALF = 150 // bust half-extent in world units (independent of sampling)
const RING_RADIUS = 148
const RING_OUTER_RADIUS = 158
const CAMERA_Z = 440

const PALETTE = {
  dark: { a: 0x3fd6a3, b: 0x4aa8d8, lineOpacity: 0.85, pointOpacity: 0.9, additive: true },
  light: { a: 0x0f766e, b: 0x1d6f94, lineOpacity: 0.9, pointOpacity: 0.9, additive: false },
}

interface Sample {
  x: number
  y: number
  z: number
  lum: number
  edge: number
}

/**
 * Samples the portrait into scan-line segments and highlight points.
 * Background is removed with a border flood fill; depth is a face-dome
 * prior plus luminance shading (a relief, not a full head).
 */
function samplePortrait(img: HTMLImageElement) {
  const canvas = document.createElement('canvas')
  canvas.width = SAMPLE_SIZE
  canvas.height = SAMPLE_SIZE
  const g = canvas.getContext('2d', { willReadFrequently: true })!
  // square crop zoomed on the head, anchored near the top of the photo
  const side = Math.min(img.naturalWidth, img.naturalHeight)
  const cw = side * CROP
  g.drawImage(img, (img.naturalWidth - cw) / 2, side * 0.02, cw, cw, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE)
  const { data } = g.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE)

  const px = (x: number, y: number) => {
    const i = (y * SAMPLE_SIZE + x) * 4
    return [data[i], data[i + 1], data[i + 2]] as const
  }
  const lumAt = (x: number, y: number) => {
    const i = (y * SAMPLE_SIZE + x) * 4
    return 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
  }
  const edgeAt = (x: number, y: number) => {
    if (x < 1 || y < 1 || x >= SAMPLE_SIZE - 1 || y >= SAMPLE_SIZE - 1) return 0
    return (
      Math.abs(lumAt(x + 1, y) - lumAt(x - 1, y)) +
      Math.abs(lumAt(x, y + 1) - lumAt(x, y - 1))
    )
  }

  // Border flood fill marks the (fairly uniform) backdrop as background
  const bg = new Uint8Array(SAMPLE_SIZE * SAMPLE_SIZE)
  const queue: number[] = []
  const seeds: number[][] = []
  for (const [sx, sy] of [
    [0, 0],
    [SAMPLE_SIZE - 1, 0],
    [0, Math.floor(SAMPLE_SIZE / 3)],
    [SAMPLE_SIZE - 1, Math.floor(SAMPLE_SIZE / 3)],
  ]) {
    seeds.push([...px(sx, sy)])
  }
  const isBgColor = (x: number, y: number) => {
    const [r, gr, b] = px(x, y)
    return seeds.some(([sr, sg, sb]) => {
      const d = Math.sqrt((r - sr) ** 2 + (gr - sg) ** 2 + (b - sb) ** 2)
      return d < BG_TOLERANCE
    })
  }
  for (let x = 0; x < SAMPLE_SIZE; x++) {
    for (const y of [0, SAMPLE_SIZE - 1]) {
      if (!bg[y * SAMPLE_SIZE + x] && isBgColor(x, y)) {
        bg[y * SAMPLE_SIZE + x] = 1
        queue.push(y * SAMPLE_SIZE + x)
      }
    }
  }
  for (let y = 0; y < SAMPLE_SIZE; y++) {
    for (const x of [0, SAMPLE_SIZE - 1]) {
      if (!bg[y * SAMPLE_SIZE + x] && isBgColor(x, y)) {
        bg[y * SAMPLE_SIZE + x] = 1
        queue.push(y * SAMPLE_SIZE + x)
      }
    }
  }
  while (queue.length) {
    const idx = queue.pop()!
    const x = idx % SAMPLE_SIZE
    const y = (idx - x) / SAMPLE_SIZE
    for (const [nx, ny] of [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ]) {
      if (nx < 0 || ny < 0 || nx >= SAMPLE_SIZE || ny >= SAMPLE_SIZE) continue
      const ni = ny * SAMPLE_SIZE + nx
      if (!bg[ni] && isBgColor(nx, ny)) {
        bg[ni] = 1
        queue.push(ni)
      }
    }
  }

  const cx = SAMPLE_SIZE / 2
  const cy = SAMPLE_SIZE * 0.42 // face sits in the upper part of the crop
  const half = SAMPLE_SIZE / 2
  const scale = (WORLD_HALF * 2) / SAMPLE_SIZE

  const depthAt = (x: number, y: number, lum: number) => {
    const dx = (x - cx) / (SAMPLE_SIZE * 0.42)
    const dy = (y - cy) / (SAMPLE_SIZE * 0.62)
    const dome = Math.sqrt(Math.max(0, 1 - dx * dx - dy * dy * 0.55))
    return dome * DEPTH_DOME + (lum / 255) * DEPTH_LUMA
  }

  const rows: Sample[][] = []
  for (let y = 0; y < SAMPLE_SIZE; y += ROW_STEP) {
    const row: Sample[] = []
    for (let x = 0; x < SAMPLE_SIZE; x += COL_STEP) {
      if (bg[y * SAMPLE_SIZE + x]) {
        row.push(null as unknown as Sample)
        continue
      }
      const lum = lumAt(x, y)
      row.push({
        x: (x - half) * scale,
        y: (half - y) * scale,
        z: depthAt(x, y, lum),
        lum,
        edge: edgeAt(x, y),
      })
    }
    rows.push(row)
  }
  return rows
}

/** 1 inside the disc, easing to 0 at the ring — keeps the bust inside the circle */
function ringFade(x: number, y: number) {
  const r = Math.sqrt(x * x + y * y) / RING_RADIUS
  if (r <= 0.8) return 1
  if (r >= 1) return 0
  const t = (r - 0.8) / 0.2
  return 1 - t * t * (3 - 2 * t)
}

export default function HeroHologram({ theme }: { theme: Theme }) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let disposed = false

    const img = new Image()
    img.src = '/profile.webp'

    let cleanupScene: (() => void) | undefined

    img.onload = () => {
      if (disposed) return
      const rows = samplePortrait(img)
      const palette = PALETTE[theme]

      const width = mount.clientWidth
      const height = mount.clientHeight
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(width, height)
      renderer.setClearColor(0x000000, 0)
      mount.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
      camera.position.z = CAMERA_Z

      const group = new THREE.Group()
      scene.add(group)

      const colorA = new THREE.Color(palette.a)
      const colorB = new THREE.Color(palette.b)
      const tmp = new THREE.Color()

      // On dark: color scales toward black (additive glow). On light: color
      // blends toward white, so weak areas vanish into the page background.
      const composite = (strength: number) => {
        const s = Math.min(Math.max(strength, 0), 1)
        return palette.additive
          ? [tmp.r * s, tmp.g * s, tmp.b * s]
          : [1 - (1 - tmp.r) * s, 1 - (1 - tmp.g) * s, 1 - (1 - tmp.b) * s]
      }

      const linePos: number[] = []
      const lineCol: number[] = []
      const pointPos: number[] = []
      const pointCol: number[] = []

      for (const row of rows) {
        for (let i = 0; i < row.length - 1; i++) {
          const a = row[i]
          const b = row[i + 1]
          if (!a) continue
          const fadeA = ringFade(a.x, a.y)
          if (b) {
            const fadeB = ringFade(b.x, b.y)
            if (fadeA > 0.02 || fadeB > 0.02) {
              const shade = (s: Sample, fade: number) => {
                tmp.copy(colorA).lerp(colorB, 1 - s.lum / 255)
                const featureBoost = Math.min(s.edge / 130, 1)
                const strength = palette.additive
                  ? 0.1 + 0.75 * Math.pow(s.lum / 255, 1.4) + featureBoost * 0.6
                  : 0.4 + 0.35 * (1 - s.lum / 255) + featureBoost * 0.55
                return composite(strength * fade)
              }
              linePos.push(a.x, a.y, a.z, b.x, b.y, b.z)
              lineCol.push(...shade(a, fadeA), ...shade(b, fadeB))
            }
          }
          if (a.edge > 50 && i % 2 === 0 && fadeA > 0.05) {
            pointPos.push(a.x, a.y, a.z + 1.5)
            tmp.copy(colorA).lerp(colorB, 1 - a.lum / 255)
            pointCol.push(...composite(fadeA))
          }
        }
      }

      const lineGeo = new THREE.BufferGeometry()
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3))
      lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineCol, 3))
      const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: palette.lineOpacity,
        blending: palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
        depthWrite: false,
      })
      group.add(new THREE.LineSegments(lineGeo, lineMat))

      const pointGeo = new THREE.BufferGeometry()
      pointGeo.setAttribute('position', new THREE.Float32BufferAttribute(pointPos, 3))
      pointGeo.setAttribute('color', new THREE.Float32BufferAttribute(pointCol, 3))
      const pointMat = new THREE.PointsMaterial({
        vertexColors: true,
        size: 2,
        sizeAttenuation: false,
        transparent: true,
        opacity: palette.pointOpacity,
        blending: palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
        depthWrite: false,
      })
      group.add(new THREE.Points(pointGeo, pointMat))

      // Containment rings: a solid inner circle and a slowly spinning dashed
      // outer circle (a nod to the original photo's dashed ring)
      const circleGeo = (radius: number) => {
        const pts: THREE.Vector3[] = []
        for (let i = 0; i <= 128; i++) {
          const a = (i / 128) * Math.PI * 2
          pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0))
        }
        return new THREE.BufferGeometry().setFromPoints(pts)
      }
      const ringGeo = circleGeo(RING_RADIUS)
      const ringMat = new THREE.LineBasicMaterial({
        color: palette.a,
        transparent: true,
        opacity: theme === 'dark' ? 0.5 : 0.6,
        blending: palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
        depthWrite: false,
      })
      group.add(new THREE.Line(ringGeo, ringMat))

      const outerGeo = circleGeo(RING_OUTER_RADIUS)
      const outerMat = new THREE.LineDashedMaterial({
        color: palette.b,
        transparent: true,
        opacity: theme === 'dark' ? 0.35 : 0.45,
        dashSize: 10,
        gapSize: 7,
        blending: palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
        depthWrite: false,
      })
      const outerRing = new THREE.Line(outerGeo, outerMat)
      outerRing.computeLineDistances()
      group.add(outerRing)

      // Mouse-follow tilt (auto-sway when there is no fine pointer)
      const hasPointer = window.matchMedia('(pointer: fine)').matches
      const target = { x: 0, y: 0 }
      const onMouseMove = (e: MouseEvent) => {
        target.y = ((e.clientX / window.innerWidth) * 2 - 1) * 0.4
        target.x = ((e.clientY / window.innerHeight) * 2 - 1) * 0.25
      }
      if (hasPointer) window.addEventListener('mousemove', onMouseMove)

      const resize = () => {
        const w = mount.clientWidth
        const h = mount.clientHeight
        if (!w || !h) return
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(mount)

      let animId = 0
      const clock = new THREE.Clock()
      const animate = () => {
        animId = requestAnimationFrame(animate)
        const t = clock.getElapsedTime()
        if (!hasPointer) {
          target.y = Math.sin(t * 0.6) * 0.28
          target.x = Math.sin(t * 0.4) * 0.1
        }
        group.rotation.y += (target.y - group.rotation.y) * 0.06
        group.rotation.x += (target.x - group.rotation.x) * 0.06
        outerRing.rotation.z = t * 0.15
        renderer.render(scene, camera)
      }
      animate()

      cleanupScene = () => {
        cancelAnimationFrame(animId)
        if (hasPointer) window.removeEventListener('mousemove', onMouseMove)
        resizeObserver.disconnect()
        mount.removeChild(renderer.domElement)
        renderer.dispose()
        lineGeo.dispose()
        pointGeo.dispose()
        ringGeo.dispose()
        outerGeo.dispose()
        lineMat.dispose()
        pointMat.dispose()
        ringMat.dispose()
        outerMat.dispose()
      }
    }

    return () => {
      disposed = true
      cleanupScene?.()
    }
  }, [theme])

  return (
    <div
      ref={mountRef}
      className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96"
      aria-hidden="true"
    />
  )
}
