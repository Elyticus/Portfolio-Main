import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { Theme } from '@/hooks/useTheme'

const PARTICLE_COUNT = 120
const CONNECTION_DISTANCE = 150
const MOUSE_FORCE_RADIUS = 100

// De-neoned brand colors; light theme needs darker, quieter particles to read on white
const PALETTE = {
  dark: { particle: 0x3fd6a3, lineA: 0x3fd6a3, lineB: 0x4aa8d8, opacity: 0.6 },
  light: { particle: 0x0f766e, lineA: 0x0f766e, lineB: 0x1d6f94, opacity: 0.3 },
}

export default function ThreeBackground({ theme }: { theme: Theme }) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 400

    // Particles
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities: THREE.Vector3[] = []
    const originalPositions: THREE.Vector3[] = []

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * window.innerWidth * 0.9
      const y = (Math.random() - 0.5) * window.innerHeight * 0.9
      const z = (Math.random() - 0.5) * 200

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      originalPositions.push(new THREE.Vector3(x, y, z))
      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
          0
        )
      )
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const palette = PALETTE[theme]
    const material = new THREE.PointsMaterial({
      color: palette.particle,
      size: 3,
      transparent: true,
      opacity: palette.opacity,
      sizeAttenuation: false,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Lines geometry (max connections)
    const maxLines = PARTICLE_COUNT * PARTICLE_COUNT
    const linePositions = new Float32Array(maxLines * 6)
    const lineColors = new Float32Array(maxLines * 6)
    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3))

    const lineMaterial = new THREE.LineSegments(
      lineGeometry,
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.4 })
    )
    scene.add(lineMaterial)

    // Mouse tracking in 3D
    const mouse3D = new THREE.Vector3(9999, 9999, 0)

    const onMouseMove = (e: MouseEvent) => {
      mouse3D.x = (e.clientX - window.innerWidth / 2)
      mouse3D.y = -(e.clientY - window.innerHeight / 2)
    }
    window.addEventListener('mousemove', onMouseMove)

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    let animId: number
    const pos = geometry.attributes.position as THREE.BufferAttribute

    const colorA = new THREE.Color(palette.lineA)
    const colorB = new THREE.Color(palette.lineB)

    const animate = () => {
      animId = requestAnimationFrame(animate)

      // Update particle positions
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3
        let x = pos.array[ix] as number
        let y = pos.array[ix + 1] as number

        // Mouse repulsion
        const dx = x - mouse3D.x
        const dy = y - mouse3D.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < MOUSE_FORCE_RADIUS) {
          const force = (MOUSE_FORCE_RADIUS - dist) / MOUSE_FORCE_RADIUS
          velocities[i].x += (dx / dist) * force * 0.8
          velocities[i].y += (dy / dist) * force * 0.8
        }

        // Drift back toward original position
        const orig = originalPositions[i]
        velocities[i].x += (orig.x - x) * 0.002
        velocities[i].y += (orig.y - y) * 0.002

        // Damping
        velocities[i].multiplyScalar(0.96)

        x += velocities[i].x
        y += velocities[i].y

        ;(pos.array as Float32Array)[ix] = x
        ;(pos.array as Float32Array)[ix + 1] = y
      }
      pos.needsUpdate = true

      // Draw connection lines
      let lineIdx = 0
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const ax = pos.array[i * 3] as number
          const ay = pos.array[i * 3 + 1] as number
          const bx = pos.array[j * 3] as number
          const by = pos.array[j * 3 + 1] as number
          const d = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2)

          if (d < CONNECTION_DISTANCE) {
            const alpha = 1 - d / CONNECTION_DISTANCE
            const mixedColor = colorA.clone().lerp(colorB, d / CONNECTION_DISTANCE)

            ;(linePositions as Float32Array)[lineIdx * 6] = ax
            ;(linePositions as Float32Array)[lineIdx * 6 + 1] = ay
            ;(linePositions as Float32Array)[lineIdx * 6 + 2] = 0
            ;(linePositions as Float32Array)[lineIdx * 6 + 3] = bx
            ;(linePositions as Float32Array)[lineIdx * 6 + 4] = by
            ;(linePositions as Float32Array)[lineIdx * 6 + 5] = 0

            ;(lineColors as Float32Array)[lineIdx * 6] = mixedColor.r * alpha
            ;(lineColors as Float32Array)[lineIdx * 6 + 1] = mixedColor.g * alpha
            ;(lineColors as Float32Array)[lineIdx * 6 + 2] = mixedColor.b * alpha
            ;(lineColors as Float32Array)[lineIdx * 6 + 3] = mixedColor.r * alpha
            ;(lineColors as Float32Array)[lineIdx * 6 + 4] = mixedColor.g * alpha
            ;(lineColors as Float32Array)[lineIdx * 6 + 5] = mixedColor.b * alpha

            lineIdx++
          }
        }
      }

      lineGeometry.setDrawRange(0, lineIdx * 2)
      ;(lineGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true
      ;(lineGeometry.attributes.color as THREE.BufferAttribute).needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
      geometry.dispose()
      lineGeometry.dispose()
      material.dispose()
    }
  }, [theme])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  )
}
