import type { CSSProperties, ReactNode } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function ScrollReveal({ children, className = '', style }: ScrollRevealProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      style={style}
      className={`scroll-reveal ${visible ? 'visible' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  )
}
