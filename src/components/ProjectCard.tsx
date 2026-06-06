import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
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
      className="scroll-reveal-stagger post-card group"
      style={{ '--stagger': index } as CSSProperties}
    >
      <button type="button" className="w-full text-left" onClick={() => onOpen(project.id)}>
        <h3 className="post-card-title">{project.title}</h3>
        <p className="text-base text-[var(--color-ink-secondary)] leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)]">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <span className="hidden sm:inline text-[var(--color-border)]">·</span>
          <span className="inline-flex items-center gap-1 text-[var(--color-accent)] font-medium group-hover:gap-2 transition-all">
            Read more
            <ArrowRight size={14} />
          </span>
        </div>
      </button>
    </ScrollReveal>
  )
}
