import { STATS } from '../data/content'
import { ScrollReveal } from './ScrollReveal'

export function StatsBar() {
  return (
    <section className="border-y border-neutral-200 bg-neutral-50">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((stat, index) => (
            <ScrollReveal
              key={stat.label}
              className={`stat-card p-8 md:p-12 text-center ${
                index === 0 ? 'border-r border-neutral-200' : ''
              } ${index === 1 ? 'md:border-r border-neutral-200' : ''} ${
                index === 2 ? 'border-r border-neutral-200 border-t md:border-t-0' : ''
              } ${index === 3 ? 'border-t md:border-t-0' : ''}`}
            >
              <div
                className={`text-4xl md:text-5xl font-light tracking-tighter ${
                  stat.highlight ? 'text-orange-600' : 'text-neutral-900'
                }`}
              >
                {stat.value}
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mt-2">
                {stat.label}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
