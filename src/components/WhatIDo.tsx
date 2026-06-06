import type { CSSProperties } from 'react'
import { SERVICES } from '../data/content'
import { ScrollReveal } from './ScrollReveal'

export function WhatIDo() {
  return (
    <section id="services" className="py-20 md:py-28 bg-[var(--color-surface)]">
      <div className="page-container">
        <ScrollReveal>
          <h2 className="section-title text-center mb-12 md:mb-16">What I Do</h2>
        </ScrollReveal>

        <div className="space-y-0">
          {SERVICES.map((service, index) => (
            <ScrollReveal
              key={service.title}
              className="scroll-reveal-stagger service-item"
              style={{ '--stagger': index } as CSSProperties}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <h3 className="service-title">{service.title}</h3>
                <span className="text-sm text-[var(--color-muted)] whitespace-nowrap">
                  {service.years}
                </span>
              </div>
              <p className="text-base text-[var(--color-ink-secondary)] leading-relaxed m-0">
                {service.description}
              </p>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="text-center mt-14 md:mt-16">
          <a href="#contact" className="btn-primary">
            Get in touch
          </a>
        </ScrollReveal>
      </div>
    </section>
  )
}
