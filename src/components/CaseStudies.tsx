import { ArrowRight } from 'lucide-react'
import { CASE_STUDIES } from '../data/content'

interface CaseStudiesProps {
  onOpenModal: (id: string) => void
}

export function CaseStudies({ onOpenModal }: CaseStudiesProps) {
  return (
    <section id="case-studies" className="py-24 md:py-32 bg-neutral-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 dark-grid-bg pointer-events-none" />
      <div className="max-w-screen-2xl mx-auto px-6 relative">
        <div className="text-center mb-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-4 block">
            Deep Dives
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tighter mb-6">
            Case Studies
          </h2>
          <p className="text-lg font-light text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            A closer look at the problems I solved, the decisions I made, and the outcomes I
            delivered.
          </p>
        </div>

        {CASE_STUDIES.map((study, studyIndex) => (
          <div
            key={study.id}
            className={`border border-neutral-800 group hover:border-neutral-700 transition-colors duration-300 ${
              studyIndex < CASE_STUDIES.length - 1 ? 'mb-8' : ''
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
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
          </div>
        ))}
      </div>
    </section>
  )
}

function StudyImage({ study, imageRight }: { study: (typeof CASE_STUDIES)[0]; imageRight?: boolean }) {
  return (
    <div className={`overflow-hidden ${imageRight ? 'order-1 lg:order-2' : ''}`}>
      <img
        src={study.image}
        alt={`${study.title} Case Study`}
        className="w-full h-64 lg:h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
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
      className={`p-8 md:p-12 lg:p-16 flex flex-col justify-center ${
        imageRight ? 'order-2 lg:order-1' : ''
      }`}
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-orange-500 px-3 py-1 border border-orange-600/30">
          {study.category}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
          {study.year}
        </span>
      </div>
      <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">{study.title}</h3>
      <p className="text-neutral-400 leading-relaxed mb-8">{study.description}</p>
      <div className="grid grid-cols-3 gap-6 mb-8">
        {study.stats.map((stat) => (
          <div key={stat.label}>
            <div className="text-2xl font-light tracking-tighter text-orange-500">{stat.value}</div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        {study.skills.map((skill) => (
          <span
            key={skill}
            className="text-[10px] font-mono text-neutral-500 border border-neutral-700 px-2 py-1"
          >
            {skill}
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onOpenModal(study.projectId)}
        className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-colors group/btn"
      >
        Read Full Case Study
        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  )
}
