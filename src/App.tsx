import { lazy, Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Projects from '@/components/Projects'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import { useTheme } from '@/hooks/useTheme'

// three.js is by far the heaviest dependency — keep it out of the initial bundle
const ThreeBackground = lazy(() => import('@/components/ThreeBackground'))

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:z-100 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:rounded-md focus:bg-primary focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Suspense fallback={null}>
        <ThreeBackground theme={theme} />
      </Suspense>
      <div className="relative z-10">
        <Navbar theme={theme} onToggleTheme={toggle} />
        <main id="main">
          <Hero theme={theme} />
          <Projects />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  )
}
