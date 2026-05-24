import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { PROJECT_TYPES } from '../data/content'
import { SocialLinks } from './SocialLinks'

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
    <section id="contact" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="max-w-screen-2xl mx-auto px-6 relative">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-orange-600 mb-4 block">
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tighter mb-6">
            Let&apos;s build something
            <br />
            <span className="text-neutral-400">remarkable together</span>
          </h2>
          <p className="text-lg font-light text-neutral-500 leading-relaxed mb-12">
            Send me a message or book a quick call — let&apos;s build something great.
          </p>

          <form onSubmit={handleSubmit} className="text-left space-y-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2 block">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-neutral-300 px-4 py-4 text-sm focus:outline-none focus:border-orange-600 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full border border-neutral-300 px-4 py-4 text-sm focus:outline-none focus:border-orange-600 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2 block">
                Project Type
              </label>
              <select className="w-full border border-neutral-300 px-4 py-4 text-sm text-neutral-500 focus:outline-none focus:border-orange-600 transition-colors bg-white">
                {PROJECT_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2 block">
                Message
              </label>
              <textarea
                rows={5}
                required
                className="w-full border border-neutral-300 px-4 py-4 text-sm focus:outline-none focus:border-orange-600 transition-colors resize-none"
                placeholder="Tell me about your project..."
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 bg-neutral-900 text-white text-xs font-medium uppercase tracking-widest px-12 py-4 hover:bg-orange-600 transition-colors duration-300 disabled:opacity-70"
              >
                {sending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={14} />
                  </>
                )}
              </button>
            </div>
            {showSuccess && (
              <div className="text-center py-4 bg-green-50 border border-green-200">
                <p className="text-sm text-green-700 font-medium">
                  Message sent! I&apos;ll get back to you within 24 hours.
                </p>
              </div>
            )}
          </form>

          <SocialLinks />
        </div>
      </div>
    </section>
  )
}
