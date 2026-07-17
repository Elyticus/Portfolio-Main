import ThreeBackground from '@/components/ThreeBackground'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Projects from '@/components/Projects'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import { useTheme } from '@/hooks/useTheme'

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
      <ThreeBackground theme={theme} />
      <div className="relative z-10">
        <Navbar theme={theme} onToggleTheme={toggle} />
        <main id="main">
          <Hero />
          <Projects />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  )
}
