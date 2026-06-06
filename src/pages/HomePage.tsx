import { useState } from 'react'
import { About } from '../components/About'
import { Blog } from '../components/Blog'
import { CaseStudies } from '../components/CaseStudies'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { Navbar } from '../components/Navbar'
import { ProjectModal } from '../components/ProjectModal'
import { Projects } from '../components/Projects'
import { StatsBar } from '../components/StatsBar'
import { WhatIDo } from '../components/WhatIDo'
import { PROJECTS } from '../data/content'

export function HomePage() {
  const [openModalId, setOpenModalId] = useState<string | null>(null)
  const openProject = PROJECTS.find((p) => p.id === openModalId) ?? null

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <StatsBar />
        <WhatIDo />
        <Projects onOpenModal={setOpenModalId} />
        <CaseStudies onOpenModal={setOpenModalId} />
        <Blog />
        <About />
        <Contact />
      </main>
      <Footer />
      <ProjectModal project={openProject} onClose={() => setOpenModalId(null)} />
    </>
  )
}
