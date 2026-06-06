import { Link } from 'react-router-dom'
import { SITE_NAME } from '../data/content'
import { SocialLinks } from './SocialLinks'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="dark-section py-12 border-t border-white/10">
      <div className="page-container-wide">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <Link
              to="/"
              className="font-serif text-xl font-bold hover:text-[#d4c4a8] transition-colors"
            >
              {SITE_NAME}
            </Link>
            <p className="text-xs opacity-50 mt-2">
              © {year} {SITE_NAME}. All rights reserved.
            </p>
          </div>

          <SocialLinks variant="dark" />

          <div className="flex items-center gap-6 text-sm opacity-70">
            <Link to="/" className="hover:opacity-100 transition-opacity">
              Top
            </Link>
            <a href="/#projects" className="hover:opacity-100 transition-opacity">
              Work
            </a>
            <Link to="/blog" className="hover:opacity-100 transition-opacity">
              Blog
            </Link>
            <a href="/#contact" className="hover:opacity-100 transition-opacity">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
