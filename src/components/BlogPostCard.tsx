import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { BlogPostMeta } from '../lib/blog'
import { getPostPath } from '../lib/blog'
import { ScrollReveal } from './ScrollReveal'

interface BlogPostCardProps {
  post: BlogPostMeta
  index: number
}

export function BlogPostCard({ post, index }: BlogPostCardProps) {
  return (
    <ScrollReveal
      className="scroll-reveal-stagger post-card group"
      style={{ '--stagger': index } as CSSProperties}
    >
      <Link to={getPostPath(post.slug)} className="block w-full text-left">
        <h3 className="post-card-title inline-flex items-start gap-2">
          {post.title}
          <ArrowUpRight
            size={18}
            className="shrink-0 mt-1 text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors"
          />
        </h3>
        <p className="text-base text-[var(--color-ink-secondary)] leading-relaxed mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)]">
          <span>{post.date}</span>
          <span className="text-[var(--color-border)]">·</span>
          <span>{post.readTime}</span>
          <span className="hidden sm:inline text-[var(--color-border)]">·</span>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </ScrollReveal>
  )
}
