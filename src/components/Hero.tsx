import { HERO_INTRO, HERO_TAGLINE, SITE_NAME } from '../data/content'

export function Hero() {
  return (
    <section
      id="hero"
      className="min-h-[100dvh] flex flex-col justify-center items-center text-center pt-20 pb-16"
    >
      <div className="page-container">
        <p className="hero-animate hero-delay-1 flex items-center justify-center gap-2 text-sm text-[var(--color-muted)] mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-500 status-dot" />
          Available for new projects
        </p>

        <h1 className="hero-animate hero-delay-2 font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
          Hello,
          <br />
          I&apos;m {SITE_NAME}
        </h1>

        <p className="hero-animate hero-delay-3 font-serif text-xl md:text-2xl text-[var(--color-ink)] leading-relaxed max-w-2xl mx-auto mb-4">
          {HERO_INTRO}
        </p>

        <p className="hero-animate hero-delay-3 text-lg text-[var(--color-ink-secondary)] leading-relaxed max-w-xl mx-auto mb-10">
          {HERO_TAGLINE}
        </p>

        <div className="hero-animate hero-delay-4 flex flex-wrap items-center justify-center gap-4">
          <a href="#projects" className="btn-primary">
            View projects
          </a>
          <a href="#about" className="text-link text-base font-medium">
            About me
          </a>
        </div>
      </div>
    </section>
  )
}
