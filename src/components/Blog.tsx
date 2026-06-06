import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getAllPosts } from '../lib/blog'
import { BlogPostCard } from './BlogPostCard'
import { ScrollReveal } from './ScrollReveal'

export function Blog() {
  const posts = getAllPosts()

  return (
    <section id="blog" className="py-20 md:py-28 bg-[var(--color-surface)]">
      <div className="page-container-wide">
        <ScrollReveal className="mb-10 md:mb-14">
          <p className="section-eyebrow mb-3">Writing</p>
          <h2 className="section-title">From the Blog</h2>
        </ScrollReveal>

        <div>
          {posts.map((post, index) => (
            <BlogPostCard key={post.slug} post={post} index={index} />
          ))}
        </div>

        <ScrollReveal className="mt-8 text-center">
          <Link to="/blog" className="btn-ghost">
            View all posts
            <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
