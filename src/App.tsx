import { useState } from 'react'
import { About } from './components/About'
import { CaseStudies } from './components/CaseStudies'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { ProjectModal } from './components/ProjectModal'
import { Projects } from './components/Projects'
import { StatsBar } from './components/StatsBar'
import { Testimonials } from './components/Testimonials'
import { PROJECTS } from './data/content'

export default function App() {
  const [openModalId, setOpenModalId] = useState<string | null>(null)

  const openProject = PROJECTS.find((p) => p.id === openModalId) ?? null

  return (
    <div className="font-sans bg-white text-neutral-900">
      <Navbar />
      <Hero />
      <StatsBar />
      <Projects onOpenModal={setOpenModalId} />
      <CaseStudies onOpenModal={setOpenModalId} />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
      <ProjectModal project={openProject} onClose={() => setOpenModalId(null)} />
    </div>
  )
}
