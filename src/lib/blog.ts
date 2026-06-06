import yaml from 'js-yaml'

export interface BlogPostMeta {
  slug: string
  title: string
  date: string
  readTime: string
  tags: string[]
  excerpt: string
  author: string
  sourceUrl: string
  sourceName: string
}

export interface BlogPost extends BlogPostMeta {
  content: string
}

const modules = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) {
    throw new Error('Blog post is missing YAML frontmatter')
  }
  const data = yaml.load(match[1]) as Record<string, unknown>
  return { data, content: match[2].trim() }
}

function parseFile(raw: string): BlogPost {
  const { data, content } = parseFrontmatter(raw)
  return {
    slug: data.slug as string,
    title: data.title as string,
    date: data.date as string,
    readTime: data.readTime as string,
    tags: (data.tags as string[]) ?? [],
    excerpt: data.excerpt as string,
    author: data.author as string,
    sourceUrl: data.sourceUrl as string,
    sourceName: data.sourceName as string,
    content,
  }
}

const posts: BlogPost[] = Object.values(modules)
  .map(parseFile)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export function getAllPosts(): BlogPostMeta[] {
  return posts.map(({ content: _content, ...meta }) => meta)
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getPostPath(slug: string) {
  return `/blog/${slug}`
}
