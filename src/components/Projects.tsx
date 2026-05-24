import { useState } from 'react'
import { PROJECT_FILTERS, PROJECTS, type ProjectFilter } from '../data/content'
import { ProjectCard } from './ProjectCard'

interface ProjectsProps {
  onOpenModal: (id: string) => void
}

export function Projects({ onOpenModal }: ProjectsProps) {
  const [filter, setFilter] = useState<ProjectFilter>('all')

  const filtered =
    filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)

  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-orange-600 mb-4 block">
              Selected Work
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tighter">
              Featured Projects
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {PROJECT_FILTERS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={`filter-btn text-xs font-medium uppercase tracking-widest px-4 py-2 border border-neutral-300 ${
                  filter === id ? 'active' : 'text-neutral-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={onOpenModal}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
