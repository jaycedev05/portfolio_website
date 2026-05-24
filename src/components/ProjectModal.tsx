import { useEffect, useRef } from 'react'
import { CheckCircle, ExternalLink, X } from 'lucide-react'
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
        className="modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="modal-content absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-white overflow-y-auto">
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 p-6 border-b border-neutral-200 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Case Study
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 md:p-10">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-64 object-cover mb-8 border border-neutral-200"
          />
          <div className="flex gap-2 mb-4">
            {project.modalTags.map((tag, i) => (
              <span
                key={tag}
                className={`text-[10px] font-semibold uppercase tracking-widest px-3 py-1 border ${
                  i === 0
                    ? 'text-orange-600 border-orange-200 bg-orange-50'
                    : 'text-neutral-500 border-neutral-200'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
          <h2 id="modal-title" className="text-3xl font-semibold tracking-tight mb-4">
            {project.title}
          </h2>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 mb-6"
          >
            Visit live product
            <ExternalLink size={14} />
          </a>
          <p className="text-neutral-500 leading-relaxed mb-8">{project.summary}</p>

          {project.challenge && (
            <>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
                The Challenge
              </h4>
              <p className="text-sm text-neutral-600 leading-relaxed mb-8">{project.challenge}</p>
            </>
          )}

          {project.approach && project.approach.length > 0 && (
            <>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
                My Approach
              </h4>
              <ul className="space-y-3 mb-8">
                {project.approach.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-neutral-600">
                    <CheckCircle size={16} className="text-orange-600 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}

          <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
            Results
          </h4>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {project.results.map((stat) => (
              <div
                key={stat.label}
                className="bg-neutral-50 p-4 border border-neutral-200 text-center"
              >
                <div className="text-2xl font-light tracking-tighter text-orange-600">
                  {stat.value}
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
            Tech Stack
          </h4>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.modalTechStack.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono text-neutral-600 bg-neutral-100 px-3 py-1.5"
              >
                {tech}
              </span>
            ))}
          </div>

          {project.role && (
            <>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
                My Role
              </h4>
              <p className="text-sm text-neutral-600 leading-relaxed">{project.role}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
