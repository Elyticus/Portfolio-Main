import ThreeBackground from '@/components/ThreeBackground'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Projects from '@/components/Projects'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <ThreeBackground />
      <div className="relative z-10">
        <Navbar />
        <main>
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
