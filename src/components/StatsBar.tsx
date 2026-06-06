import type { CSSProperties } from 'react'
import { STATS } from '../data/content'
import { ScrollReveal } from './ScrollReveal'

export function StatsBar() {
  return (
    <section className="py-12 border-y border-[var(--color-border)]">
      <div className="page-container-wide">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {STATS.map((stat, index) => (
            <ScrollReveal
              key={stat.label}
              className="scroll-reveal-stagger text-center"
              style={{ '--stagger': index } as CSSProperties}
            >
              <div
                className={`font-serif text-3xl md:text-4xl font-bold tracking-tight ${
                  stat.highlight ? 'text-[var(--color-accent)]' : 'text-[var(--color-ink)]'
                }`}
              >
                {stat.value}
              </div>
              <div className="text-sm text-[var(--color-muted)] mt-1">{stat.label}</div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
