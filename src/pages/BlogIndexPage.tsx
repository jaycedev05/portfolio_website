import { Link } from 'react-router-dom'
import { BlogPostCard } from '../components/BlogPostCard'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { ScrollReveal } from '../components/ScrollReveal'
import { getAllPosts } from '../lib/blog'

export function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <div className="bg-white text-[var(--color-ink)]">
      <Navbar />
      <main className="py-24 md:py-32">
        <div className="page-container-wide">
          <ScrollReveal className="mb-10 md:mb-14">
            <Link
              to="/"
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors mb-6 inline-block"
            >
              ← Home
            </Link>
            <p className="section-eyebrow mb-3">Writing</p>
            <h1 className="section-title">From the Blog</h1>
            <p className="text-lg text-[var(--color-ink-secondary)] leading-relaxed max-w-2xl mt-4">
              Notes on AI, MCPs, production engineering, and building software with agents.
            </p>
          </ScrollReveal>

          <div>
            {posts.map((post, index) => (
              <BlogPostCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
