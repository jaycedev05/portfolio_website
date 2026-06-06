import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SITE_NAME } from '../data/content'
import { useActiveSection } from '../hooks/useActiveSection'

const SECTION_LINKS = [
  { hash: '#projects', label: 'Projects' },
  { hash: '#case-studies', label: 'Case Studies' },
  { hash: '#about', label: 'About' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const activeSection = useActiveSection()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isBlogRoute = location.pathname.startsWith('/blog')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)
  const sectionHref = (hash: string) => (isHome ? hash : `/${hash}`)
  const isSectionActive = (hash: string) => isHome && hash === `#${activeSection}`

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md border-b border-[var(--color-border)] shadow-sm' : 'bg-white'
      }`}
    >
      <div className="page-container-full">
        <nav className="flex items-center justify-between h-16 md:h-20">
          <Link
            to="/"
            className="font-serif text-xl md:text-2xl font-bold text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors"
          >
            {SITE_NAME}
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {SECTION_LINKS.map((link) => (
              <a
                key={link.hash}
                href={sectionHref(link.hash)}
                className={`nav-link ${isSectionActive(link.hash) ? 'active' : ''}`}
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/blog"
              className={`nav-link ${isBlogRoute ? 'active' : ''}`}
            >
              Blog
            </Link>
            <a href={sectionHref('#contact')} className="btn-primary !py-2 !px-5 !text-sm">
              Contact
            </a>
          </div>

          <button
            type="button"
            className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8 p-1"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span
              className={`block h-0.5 bg-[var(--color-ink)] transition-all duration-300 ${
                mobileOpen ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 bg-[var(--color-ink)] transition-all duration-300 ${
                mobileOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-0.5 bg-[var(--color-ink)] transition-all duration-300 ${
                mobileOpen ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </button>
        </nav>
      </div>

      <div
        className={`md:hidden fixed inset-0 top-16 bg-white z-40 transition-all duration-300 ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="page-container py-8 flex flex-col gap-5">
          {SECTION_LINKS.map((link) => (
            <a
              key={link.hash}
              href={sectionHref(link.hash)}
              onClick={closeMobile}
              className={`text-lg font-serif ${isSectionActive(link.hash) ? 'text-[var(--color-accent)]' : 'text-[var(--color-ink)]'}`}
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/blog"
            onClick={closeMobile}
            className={`text-lg font-serif ${isBlogRoute ? 'text-[var(--color-accent)]' : 'text-[var(--color-ink)]'}`}
          >
            Blog
          </Link>
          <a
            href={sectionHref('#contact')}
            onClick={closeMobile}
            className="btn-primary mt-4 justify-center"
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  )
}
