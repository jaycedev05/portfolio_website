import { SITE_HANDLE, SITE_NAME } from '../data/content'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-neutral-200 py-12">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-orange-600" />
            <span className="text-sm font-semibold tracking-tight">{SITE_HANDLE}</span>
          </div>
          <div className="text-xs text-neutral-400">
            © {year} {SITE_NAME}. Built with care.
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#hero"
              className="text-xs text-neutral-400 hover:text-orange-600 transition-colors uppercase tracking-widest"
            >
              Top
            </a>
            <a
              href="#projects"
              className="text-xs text-neutral-400 hover:text-orange-600 transition-colors uppercase tracking-widest"
            >
              Work
            </a>
            <a
              href="#contact"
              className="text-xs text-neutral-400 hover:text-orange-600 transition-colors uppercase tracking-widest"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
