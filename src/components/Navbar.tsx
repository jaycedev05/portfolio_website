import { useEffect, useState } from 'react'
import { ArrowRight, Menu } from 'lucide-react'
import { SITE_HANDLE } from '../data/content'
import { useActiveSection } from '../hooks/useActiveSection'

const NAV_LINKS = [
  { href: '#projects', label: 'Projects' },
  { href: '#case-studies', label: 'Case Studies' },
  { href: '#about', label: 'About' },
  { href: '#testimonials', label: 'Testimonials' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const activeSection = useActiveSection()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMobile = () => setMobileOpen(false)

  const isActive = (href: string) => href === `#${activeSection}`

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: scrolled ? '1px solid #E5E5E5' : 'none',
      }}
    >
      <div className="max-w-screen-2xl mx-auto w-full px-6 flex items-center justify-between relative">
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-4 h-4 bg-orange-600 group-hover:rotate-45 transition-transform duration-300" />
          <span className="text-lg font-semibold tracking-tight">{SITE_HANDLE}</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link text-xs font-medium uppercase tracking-widest transition-colors ${
                isActive(link.href)
                  ? 'active text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white text-xs font-medium uppercase tracking-widest px-6 py-3 hover:bg-orange-600 transition-colors duration-300"
          >
            Let&apos;s Talk
            <ArrowRight size={14} />
          </a>
        </div>

        <button
          type="button"
          className="md:hidden p-2"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </div>

      <div
        className={`absolute top-20 left-0 right-0 bg-white border-b border-neutral-200 md:hidden ${
          mobileOpen ? '' : 'hidden'
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMobile}
              className="text-sm font-medium text-neutral-600 hover:text-orange-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={closeMobile}
            className="inline-flex items-center justify-center gap-2 bg-neutral-900 text-white text-sm font-medium px-6 py-3 mt-2"
          >
            Let&apos;s Talk
          </a>
        </div>
      </div>
    </nav>
  )
}
