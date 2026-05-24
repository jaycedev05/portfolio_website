import { Star } from 'lucide-react'
import { TESTIMONIALS } from '../data/content'
import { ScrollReveal } from './ScrollReveal'

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-neutral-50 border-y border-neutral-200">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-orange-600 mb-4 block">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tighter">
            What people say
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <ScrollReveal
              key={testimonial.name}
              className="testimonial-card bg-white border border-neutral-200 p-8 md:p-10"
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="text-orange-600"
                    fill={i === 0 ? '#EA580C' : 'currentColor'}
                  />
                ))}
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed mb-8">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden">
                  <img
                    src={testimonial.avatar}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold">{testimonial.name}</div>
                  <div className="text-xs text-neutral-400">{testimonial.role}</div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
