import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const SECTION_IDS = ['hero', 'projects', 'case-studies', 'blog', 'about', 'contact']

export function useActiveSection() {
  const [activeId, setActiveId] = useState('hero')
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname !== '/') return

    const onScroll = () => {
      let current = SECTION_IDS[0]
      for (const id of SECTION_IDS) {
        const section = document.getElementById(id)
        if (section && window.scrollY >= section.offsetTop - 100) {
          current = id
        }
      }
      setActiveId(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  return activeId
}
