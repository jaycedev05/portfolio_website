import { Children, cloneElement, isValidElement } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface BlogMarkdownProps {
  content: string
}

export function BlogMarkdown({ content }: BlogMarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => (
          <h2 className="font-serif text-2xl font-bold mt-12 mb-4 tracking-tight">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="font-serif text-xl font-bold mt-8 mb-3 tracking-tight">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="font-serif text-lg font-bold mt-6 mb-2">{children}</h4>
        ),
        p: ({ children }) => (
          <p className="text-[var(--color-ink-secondary)] leading-relaxed mb-5">{children}</p>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-link text-[var(--color-accent)]"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-6 mb-5 space-y-2 text-[var(--color-ink-secondary)]">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-6 mb-5 space-y-2 text-[var(--color-ink-secondary)]">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-[var(--color-accent)] pl-5 my-6 text-[var(--color-ink-secondary)] italic">
            {children}
          </blockquote>
        ),
        pre: ({ children }) => (
          <pre className="blog-pre not-prose">
            {Children.map(children, (child) =>
              isValidElement<{ className?: string }>(child)
                ? cloneElement(child, {
                    className: `blog-code-block ${child.props.className ?? ''}`.trim(),
                  })
                : child,
            )}
          </pre>
        ),
        code: ({ className, children, ...props }) => (
          <code className={`blog-code-inline ${className ?? ''}`.trim()} {...props}>
            {children}
          </code>
        ),
        img: ({ src, alt }) => (
          <figure className="my-8">
            <img
              src={src}
              alt={alt ?? ''}
              className="w-full rounded border border-[var(--color-border)]"
              loading="lazy"
            />
            {alt && (
              <figcaption className="text-sm text-[var(--color-muted)] mt-2 text-center">
                {alt}
              </figcaption>
            )}
          </figure>
        ),
        table: ({ children }) => (
          <div className="blog-table-wrap not-prose">
            <table className="blog-table">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="blog-table-head">{children}</thead>,
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => <tr className="blog-table-row">{children}</tr>,
        th: ({ children }) => <th className="blog-table-th">{children}</th>,
        td: ({ children }) => <td className="blog-table-td">{children}</td>,
        hr: () => <hr className="my-10 border-[var(--color-border)]" />,
        strong: ({ children }) => <strong className="font-semibold text-[var(--color-ink)]">{children}</strong>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
