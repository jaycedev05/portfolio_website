import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { CASE_STUDIES } from '../data/content'
import { ScrollReveal } from './ScrollReveal'

interface CaseStudiesProps {
  onOpenModal: (id: string) => void
}

export function CaseStudies({ onOpenModal }: CaseStudiesProps) {
  return (
    <section id="case-studies" className="py-20 md:py-28 bg-[var(--color-beige)]">
      <div className="page-container-wide">
        <ScrollReveal className="text-center mb-14 md:mb-20">
          <p className="section-eyebrow mb-3">Deep dives</p>
          <h2 className="section-title mb-5">Case Studies</h2>
          <p className="text-lg text-[var(--color-ink-secondary)] leading-relaxed max-w-2xl mx-auto">
            A closer look at the problems I solved, the decisions I made, and the outcomes I
            delivered.
          </p>
        </ScrollReveal>

        <div className="space-y-6 md:space-y-8">
          {CASE_STUDIES.map((study, studyIndex) => (
            <ScrollReveal
              key={study.id}
              className="scroll-reveal-stagger case-study-block group"
              style={{ '--stagger': studyIndex } as CSSProperties}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center">
                {study.imageRight ? (
                  <>
                    <StudyContent study={study} onOpenModal={onOpenModal} imageRight />
                    <StudyImage study={study} imageRight />
                  </>
                ) : (
                  <>
                    <StudyImage study={study} />
                    <StudyContent study={study} onOpenModal={onOpenModal} />
                  </>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function StudyImage({ study, imageRight }: { study: (typeof CASE_STUDIES)[0]; imageRight?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center bg-[var(--color-surface)] p-4 md:p-6 ${
        imageRight ? 'order-1 lg:order-2' : ''
      }`}
    >
      <img
        src={study.image}
        alt={`${study.title} Case Study`}
        className="w-full max-h-40 md:max-h-44 object-contain"
      />
    </div>
  )
}

function StudyContent({
  study,
  onOpenModal,
  imageRight,
}: {
  study: (typeof CASE_STUDIES)[0]
  onOpenModal: (id: string) => void
  imageRight?: boolean
}) {
  return (
    <div
      className={`p-5 md:p-6 lg:p-8 flex flex-col justify-center ${
        imageRight ? 'order-2 lg:order-1' : ''
      }`}
    >
      <div className="flex items-center gap-3 mb-3 text-sm text-[var(--color-muted)]">
        <span className="tag !text-[var(--color-accent)] !border-[var(--color-accent)]/30">
          {study.category}
        </span>
        <span>{study.year}</span>
      </div>

      <h3 className="font-serif text-xl md:text-2xl font-bold tracking-tight mb-3 leading-snug">
        {study.title}
      </h3>

      <p className="text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed mb-4 line-clamp-3">
        {study.description}
      </p>

      {study.stats.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {study.stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-serif text-lg md:text-xl font-bold text-[var(--color-accent)]">
                {stat.value}
              </div>
              <div className="text-xs text-[var(--color-muted)] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {study.skills.map((skill) => (
          <span key={skill} className="tag text-xs">
            {skill}
          </span>
        ))}
      </div>

      <button type="button" onClick={() => onOpenModal(study.projectId)} className="btn-ghost self-start">
        Read full case study
        <ArrowRight size={14} />
      </button>
    </div>
  )
}
