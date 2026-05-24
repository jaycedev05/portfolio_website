import { ArrowDownRight, Code2 } from 'lucide-react'
import { HERO_TAGLINE, PORTRAIT_IMAGE, SITE_NAME } from '../data/content'

export function Hero() {
  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="max-w-screen-2xl mx-auto px-6 relative">
        <div className="grid grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="col-span-12 lg:col-span-7">
            <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-dot" />
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Available for new projects
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold leading-[0.9] tracking-tighter mb-8 animate-fade-in-up stagger-1 opacity-0">
              Full-Stack
              <br />
              <span className="text-neutral-400">Developer</span>
              <br />& <span className="text-orange-600">Builder</span>
            </h1>
            <p className="text-lg md:text-xl font-light leading-relaxed text-neutral-500 max-w-xl mb-10 animate-fade-in-up stagger-2 opacity-0">
              {HERO_TAGLINE}
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up stagger-3 opacity-0">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 bg-neutral-900 text-white text-xs font-medium uppercase tracking-widest px-8 py-4 hover:bg-orange-600 transition-colors duration-300"
              >
                View Projects
                <ArrowDownRight size={14} />
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 border border-neutral-300 text-neutral-900 text-xs font-medium uppercase tracking-widest px-8 py-4 hover:border-orange-600 hover:text-orange-600 transition-colors duration-300"
              >
                About Me
              </a>
            </div>
          </div>
          <div
            className="col-span-12 lg:col-span-5 relative opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="relative">
              <div className="aspect-[3/4] bg-neutral-100 overflow-hidden border border-neutral-200">
                <img
                  src={PORTRAIT_IMAGE}
                  alt={SITE_NAME}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white border border-neutral-200 p-6 shadow-lg animate-float">
                <div className="text-4xl font-light tracking-tighter text-orange-600">9+</div>
                <div className="text-xs font-medium uppercase tracking-widest text-neutral-500 mt-1">
                  Years Exp.
                </div>
              </div>
              <div
                className="absolute -top-4 -right-4 bg-orange-600 text-white p-4 animate-float"
                style={{ animationDelay: '1s' }}
              >
                <Code2 size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
