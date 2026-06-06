import { ArrowRight, FileText } from 'lucide-react'
import {
  ABOUT_DIFFERENTIATOR,
  ABOUT_HEADLINE,
  ABOUT_PARAGRAPHS,
  EXPERIENCE,
  SKILLS,
} from '../data/content'
import { useSkillBars } from '../hooks/useSkillBars'
import { ScrollReveal } from './ScrollReveal'

export function About() {
  const { containerRef, animated } = useSkillBars()

  return (
    <section id="about" className="py-20 md:py-28">
      <div className="page-container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          <div>
            <ScrollReveal>
              <p className="section-eyebrow mb-3">About</p>
              <h2 className="section-title mb-8">{ABOUT_HEADLINE}</h2>
            </ScrollReveal>

            <ScrollReveal className="space-y-5 text-[var(--color-ink-secondary)] leading-relaxed">
              {ABOUT_PARAGRAPHS.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}

              <blockquote className="border-l-2 border-[var(--color-accent)] pl-5 py-1 my-6">
                <h3 className="font-serif text-lg font-bold text-[var(--color-ink)] mb-2">
                  {ABOUT_DIFFERENTIATOR.title}
                </h3>
                <p>{ABOUT_DIFFERENTIATOR.body}</p>
              </blockquote>
            </ScrollReveal>

            <ScrollReveal className="mt-10 flex flex-wrap gap-4">
              <a href="#contact" className="btn-primary">
                Get in touch
                <ArrowRight size={16} />
              </a>
              <a href="#" className="btn-primary !border-[var(--color-border)] !text-[var(--color-ink-secondary)] hover:!border-[var(--color-ink)]">
                <FileText size={16} />
                Resume
              </a>
            </ScrollReveal>
          </div>

          <div className="space-y-6">
            <ScrollReveal>
              <div className="border border-[var(--color-border)] rounded p-8 bg-[var(--color-surface)]" ref={containerRef}>
                <h3 className="font-serif text-lg font-bold mb-6">Core Skills</h3>
                <div className="space-y-5">
                  {SKILLS.map((skill) => (
                    <div key={skill.label}>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="font-medium">{skill.label}</span>
                        <span className="text-[var(--color-muted)]">{skill.percent}%</span>
                      </div>
                      <div className="h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
                        <div
                          className="skill-bar-fill h-full rounded-full"
                          style={{ width: animated ? `${skill.percent}%` : '0%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="border border-[var(--color-border)] rounded p-8">
                <h3 className="font-serif text-lg font-bold mb-6">Experience</h3>
                <div className="space-y-6">
                  {EXPERIENCE.map((job, index) => (
                    <div key={`${job.company}-${job.period}`} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 transition-colors ${
                            job.active ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'
                          } group-hover:bg-[var(--color-accent)]`}
                        />
                        {index < EXPERIENCE.length - 1 && (
                          <div className="w-px flex-1 bg-[var(--color-border)] mt-1" />
                        )}
                      </div>
                      <div className={index < EXPERIENCE.length - 1 ? 'pb-4' : ''}>
                        <div className="text-sm font-semibold">{job.title}</div>
                        <div
                          className={`text-sm ${
                            job.active ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]'
                          }`}
                        >
                          {job.company}
                        </div>
                        <div className="text-xs text-[var(--color-muted)] mt-1">{job.period}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
