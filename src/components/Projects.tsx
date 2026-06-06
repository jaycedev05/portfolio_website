import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { PROJECT_FILTERS, PROJECTS, type ProjectFilter } from '../data/content'
import { ProjectCard } from './ProjectCard'
import { ScrollReveal } from './ScrollReveal'

interface ProjectsProps {
  onOpenModal: (id: string) => void
}

export function Projects({ onOpenModal }: ProjectsProps) {
  const [filter, setFilter] = useState<ProjectFilter>('all')

  const filtered =
    filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)

  return (
    <section id="projects" className="py-20 md:py-28">
      <div className="page-container-wide">
        <ScrollReveal className="mb-10 md:mb-14">
          <p className="section-eyebrow mb-3">Selected work</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="section-title">Featured Projects</h2>
            <div className="flex flex-wrap gap-2">
              {PROJECT_FILTERS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilter(id)}
                  className={`filter-pill ${filter === id ? 'active' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <div>
          {filtered.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={onOpenModal}
            />
          ))}
        </div>

        <ScrollReveal className="mt-8 text-center">
          <button
            type="button"
            onClick={() => onOpenModal(filtered[0]?.id ?? PROJECTS[0].id)}
            className="btn-ghost"
          >
            View project details
            <ArrowRight size={16} />
          </button>
        </ScrollReveal>
      </div>
    </section>
  )
}
