import { useEffect, useRef } from 'react'
import { ArrowRight, ExternalLink, X } from 'lucide-react'
import type { Project } from '../data/content'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!project) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [project, onClose])

  if (!project) return null

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button
        type="button"
        className="modal-overlay absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="modal-panel absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-white overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 px-6 py-5 border-b border-[var(--color-border)] flex items-center justify-between">
          <span className="text-sm text-[var(--color-muted)]">Project details</span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-surface)] rounded transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-10">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-56 md:h-64 object-cover mb-8 rounded border border-[var(--color-border)]"
          />

          <div className="flex flex-wrap gap-2 mb-4">
            {project.modalTags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>

          <h2 id="modal-title" className="font-serif text-3xl font-bold tracking-tight mb-4">
            {project.title}
          </h2>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost mb-6"
          >
            Visit live product
            <ExternalLink size={14} />
          </a>

          <p className="text-[var(--color-ink-secondary)] leading-relaxed mb-8 text-lg">
            {project.summary}
          </p>

          {project.challenge && (
            <>
              <h4 className="font-serif text-lg font-bold mb-3">The Challenge</h4>
              <p className="text-[var(--color-ink-secondary)] leading-relaxed mb-8">
                {project.challenge}
              </p>
            </>
          )}

          {project.approach && project.approach.length > 0 && (
            <>
              <h4 className="font-serif text-lg font-bold mb-3">My Approach</h4>
              <ul className="space-y-3 mb-8">
                {project.approach.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[var(--color-ink-secondary)]">
                    <ArrowRight size={16} className="text-[var(--color-accent)] mt-1 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}

          <h4 className="font-serif text-lg font-bold mb-4">Tech Stack</h4>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.modalTechStack.map((tech) => (
              <span key={tech} className="tag text-sm">
                {tech}
              </span>
            ))}
          </div>

          {project.role && (
            <>
              <h4 className="font-serif text-lg font-bold mb-3">My Role</h4>
              <p className="text-[var(--color-ink-secondary)] leading-relaxed">{project.role}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
