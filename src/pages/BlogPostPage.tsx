import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { BlogMarkdown } from '../components/BlogMarkdown'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { getAllPosts, getPostBySlug } from '../lib/blog'

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug) : undefined
  const allPosts = getAllPosts()
  const currentIndex = allPosts.findIndex((p) => p.slug === slug)
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Jayce Garcia`
    }
    return () => {
      document.title = 'Jayce Garcia - Full-Stack Developer'
    }
  }, [post])

  if (!post) {
    return (
      <div className="bg-white text-[var(--color-ink)] min-h-screen">
        <Navbar />
        <main className="page-container py-32 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Post not found</h1>
          <Link to="/blog" className="btn-ghost">
            <ArrowLeft size={16} />
            Back to blog
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-white text-[var(--color-ink)]">
      <Navbar />
      <main className="py-24 md:py-32">
        <article className="page-container max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors mb-10"
          >
            <ArrowLeft size={16} />
            Back to blog
          </Link>

          <header className="mb-10 pb-8 border-b border-[var(--color-border)]">
            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)] mb-4">
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
              <span>·</span>
              <span>{post.author}</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-5">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="blog-prose">
            <BlogMarkdown content={post.content} />
          </div>

          <footer className="mt-14 pt-8 border-t border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-muted)] mb-6">
              Originally published on{' '}
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link text-[var(--color-accent)] inline-flex items-center gap-1"
              >
                {post.sourceName}
                <ExternalLink size={12} />
              </a>
            </p>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              {prevPost ? (
                <Link
                  to={`/blog/${prevPost.slug}`}
                  className="text-link text-sm font-medium max-w-xs"
                >
                  ← {prevPost.title}
                </Link>
              ) : (
                <span />
              )}
              {nextPost && (
                <Link
                  to={`/blog/${nextPost.slug}`}
                  className="text-link text-sm font-medium max-w-xs sm:text-right"
                >
                  {nextPost.title} →
                </Link>
              )}
            </div>
          </footer>
        </article>
      </main>
      <Footer />
    </div>
  )
}
