import { ArrowRight, ExternalLink, FileText } from 'lucide-react'
import {
  ABOUT_DIFFERENTIATOR,
  ABOUT_HEADLINE,
  ABOUT_PARAGRAPHS,
  ABOUT_STARTUP_INTRO,
  EXPERIENCE,
  PROJECTS,
  SKILLS,
} from '../data/content'
import { useSkillBars } from '../hooks/useSkillBars'

export function About() {
  const { containerRef, animated } = useSkillBars()

  return (
    <section id="about" className="py-24 md:py-32">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-orange-600 mb-4 block">
              About
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tighter mb-8">
              {ABOUT_HEADLINE}
            </h2>
            <div className="space-y-6 text-neutral-500 leading-relaxed">
              {ABOUT_PARAGRAPHS.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
              <div className="border-l-2 border-orange-600 pl-6 py-1">
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                  {ABOUT_DIFFERENTIATOR.title}
                </h3>
                <p>{ABOUT_DIFFERENTIATOR.body}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">Startup experience</h3>
                <p className="mb-4">{ABOUT_STARTUP_INTRO}</p>
                <ul className="space-y-4">
                  {PROJECTS.map((project) => (
                    <li key={project.id}>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-neutral-900 font-medium hover:text-orange-600 transition-colors"
                      >
                        {project.title}
                        <ExternalLink
                          size={14}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </a>
                      <p className="text-sm mt-1">{project.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <p>Send me a message or book a quick call — let&apos;s build something great.</p>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-neutral-900 text-white text-xs font-medium uppercase tracking-widest px-8 py-4 hover:bg-orange-600 transition-colors duration-300"
              >
                Get in Touch
                <ArrowRight size={14} />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 border border-neutral-300 text-neutral-900 text-xs font-medium uppercase tracking-widest px-8 py-4 hover:border-orange-600 hover:text-orange-600 transition-colors duration-300"
              >
                <FileText size={14} />
                Resume
              </a>
            </div>
          </div>

          <div className="space-y-8">
            <div className="border border-neutral-200 p-8" ref={containerRef}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-6">
                Core Skills
              </h3>
              <div className="space-y-5">
                {SKILLS.map((skill) => (
                  <div key={skill.label}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{skill.label}</span>
                      <span className="text-xs text-neutral-400">{skill.percent}%</span>
                    </div>
                    <div className="h-1 bg-neutral-100">
                      <div
                        className={`skill-bar-fill h-full ${
                          skill.highlight ? 'bg-orange-600' : 'bg-neutral-900'
                        }`}
                        style={{ width: animated ? `${skill.percent}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-neutral-200 p-8">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-6">
                Experience
              </h3>
              <div className="space-y-6">
                {EXPERIENCE.map((job, index) => (
                  <div key={`${job.company}-${job.period}`} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          job.active ? 'bg-orange-600' : 'bg-neutral-300'
                        }`}
                      />
                      {index < EXPERIENCE.length - 1 && (
                        <div className="w-px h-full bg-neutral-200" />
                      )}
                    </div>
                    <div className={index < EXPERIENCE.length - 1 ? 'pb-6' : ''}>
                      <div className="text-sm font-semibold">{job.title}</div>
                      <div
                        className={`text-xs font-medium ${
                          job.active ? 'text-orange-600' : 'text-neutral-500'
                        }`}
                      >
                        {job.company}
                      </div>
                      <div className="text-xs text-neutral-400 mt-1">{job.period}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
