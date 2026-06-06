import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { PROJECT_TYPES } from '../data/content'
import { SocialLinks } from './SocialLinks'
import { ScrollReveal } from './ScrollReveal'

export function Contact() {
  const [sending, setSending] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setShowSuccess(true)
      form.reset()
      setTimeout(() => setShowSuccess(false), 5000)
    }, 1500)
  }

  return (
    <section id="contact" className="dark-section min-h-[80dvh] flex flex-col justify-center py-20 md:py-28">
      <div className="page-container">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Start a conversation</h2>
          <p className="text-lg opacity-80 leading-relaxed max-w-lg mx-auto">
            Whether you have a project in mind or just want to say hello - I&apos;d love to hear
            from you.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <form onSubmit={handleSubmit} className="space-y-5 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm opacity-70 mb-2">Name</label>
                <input
                  type="text"
                  required
                  className="form-input !bg-[#2d2d2d] !border-white/15 !text-white placeholder:!text-white/40"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm opacity-70 mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="form-input !bg-[#2d2d2d] !border-white/15 !text-white placeholder:!text-white/40"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm opacity-70 mb-2">Project type</label>
              <select className="form-input !bg-[#2d2d2d] !border-white/15 !text-white/90">
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm opacity-70 mb-2">Message</label>
              <textarea
                rows={5}
                required
                className="form-input !bg-[#2d2d2d] !border-white/15 !text-white placeholder:!text-white/40 resize-none"
                placeholder="Tell me about your project..."
              />
            </div>
            <div className="text-center pt-2">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 px-8 py-3 text-base font-medium border border-white/30 rounded hover:bg-white hover:text-[var(--color-dark)] transition-all duration-300 disabled:opacity-60"
              >
                {sending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send message
                    <Send size={16} />
                  </>
                )}
              </button>
            </div>
            {showSuccess && (
              <div className="text-center py-4 border border-emerald-500/30 bg-emerald-500/10 rounded">
                <p className="text-sm text-emerald-300 font-medium">
                  Message sent! I&apos;ll get back to you within 24 hours.
                </p>
              </div>
            )}
          </form>
        </ScrollReveal>

        <ScrollReveal>
          <SocialLinks variant="dark" />
        </ScrollReveal>
      </div>
    </section>
  )
}
