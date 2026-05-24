import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../data/content'
import { ScrollReveal } from './ScrollReveal'

interface ProjectCardProps {
  project: Project
  index: number
  onOpen: (id: string) => void
}

export function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  return (
    <ScrollReveal
      className="case-study-card project-visible border border-neutral-200 group cursor-pointer"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <button
        type="button"
        className="w-full text-left"
        onClick={() => onOpen(project.id)}
      >
        <div className="overflow-hidden">
          <img
            src={project.cardImage}
            alt={project.title}
            className="card-image w-full h-64 md:h-80 object-cover"
          />
        </div>
        <div className="p-8 md:p-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="card-tag text-[10px] font-semibold uppercase tracking-widest px-3 py-1 border border-neutral-200 text-neutral-500"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="card-arrow">
              <ArrowUpRight
                size={20}
                className="text-neutral-400 group-hover:text-orange-600 transition-colors"
              />
            </div>
          </div>
          <h3 className="text-2xl font-semibold tracking-tight mb-3">{project.title}</h3>
          <p className="text-sm text-neutral-500 leading-relaxed mb-6">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-mono text-neutral-400 bg-neutral-50 px-2 py-1"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </button>
    </ScrollReveal>
  )
}
