import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as cheerio from 'cheerio'
import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const contentDir = path.join(root, 'src', 'content', 'blog')
const publicBlogDir = path.join(root, 'public', 'blog')

const POSTS = [
  {
    slug: 'k8s-ai-agent',
    sourceUrl: 'https://teotti.com/using-an-ai-agent-to-navigate-an-undocumented-kubernetes-repo/',
    title: 'Using an AI agent to navigate an undocumented Kubernetes repo',
    date: 'April 17, 2026',
    readTime: '5 min read',
    tags: ['AI', 'MCP'],
    excerpt:
      'A demo environment behaved differently from production because a Kubernetes CronJob existed only in the production overlay. An AI agent helped trace the CronJob, map stage to the demo environment, and identify the IaC files that needed changing.',
    author: 'Enrico Teotti',
    sourceName: 'teotti.com',
  },
  {
    slug: 'llm-evals-production',
    sourceUrl: 'https://teotti.com/how-to-build-evals-for-llm-prompts-in-production/',
    title: 'How to build evals for LLM prompts in production',
    date: 'April 10, 2026',
    readTime: '14 min read',
    tags: ['strategy', 'AI'],
    excerpt:
      'If you ship LLM features without evals, you are guessing. Good evals need isolated prompts, representative test data, versioned runs, and output artifacts that make results debuggable.',
    author: 'Enrico Teotti',
    sourceName: 'teotti.com',
  },
  {
    slug: 'llm-mcp-performance',
    sourceUrl: 'https://teotti.com/llm-with-mcps-assessing-application-performance/',
    title: 'LLM with MCPs assessing application performance',
    date: 'March 11, 2026',
    readTime: '5 min read',
    tags: ['strategy', 'AI', 'MCP'],
    excerpt:
      'A page had a p95 response time of 32 seconds. Using an LLM agent connected to a prod database, Sentry, and Posthog, I diagnosed the root cause, confirmed the feature was barely used, and shipped a fix - dropping p95 to 600ms.',
    author: 'Enrico Teotti',
    sourceName: 'teotti.com',
  },
  {
    slug: 'llm-mcp-debugging',
    sourceUrl: 'https://teotti.com/simplify-software-debugging-with-llm-mcp-and-source-code/',
    title: 'Faster bug triaging with AI LLMs via MCP',
    date: 'February 26, 2026',
    readTime: '5 min read',
    tags: ['strategy', 'AI', 'MCP'],
    excerpt:
      'Giving AI agents access to your application source code and DB via MCP can enhance software debugging. In 3 minutes I reached a bug root cause in a 15-year-old production app with around 200,000 lines of code.',
    author: 'Enrico Teotti',
    sourceName: 'teotti.com',
  },
]

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
})
turndown.use(gfm)

turndown.addRule('removeShareBlocks', {
  filter: (node) => {
    const cls = node.getAttribute?.('class') || ''
    return cls.includes('share') || cls.includes('post-nav') || cls.includes('related-posts')
  },
  replacement: () => '',
})

async function downloadImage(src, slug) {
  const absolute = src.startsWith('http') ? src : `https://teotti.com${src}`
  const filename = path.basename(absolute.split('?')[0])
  const outDir = path.join(publicBlogDir, slug)
  await fs.mkdir(outDir, { recursive: true })
  const outPath = path.join(outDir, filename)

  try {
    const res = await fetch(absolute)
    if (!res.ok) throw new Error(`${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    await fs.writeFile(outPath, buf)
    return `/blog/${slug}/${filename}`
  } catch (err) {
    console.warn(`  skipped image ${absolute}: ${err.message}`)
    return absolute
  }
}

async function fetchPost(post) {
  console.log(`Fetching ${post.slug}...`)
  const res = await fetch(post.sourceUrl)
  if (!res.ok) throw new Error(`Failed ${post.sourceUrl}: ${res.status}`)
  const html = await res.text()
  const $ = cheerio.load(html)

  const article = $('.prose.post-content').first()
  if (!article.length) throw new Error(`No article content for ${post.slug}`)

  article.find('script, style, .share-post, nav, .post-navigation').remove()

  const images = article.find('img').toArray()
  for (const img of images) {
    const src = $(img).attr('src')
    if (!src) continue
    const local = await downloadImage(src, post.slug)
    $(img).attr('src', local)
    const alt = $(img).attr('alt') || ''
    if (!alt) $(img).attr('alt', post.title)
  }

  let markdown = turndown.turndown(article.html())
  markdown = markdown
    .replace(/\n{3,}/g, '\n\n')
    .replace(/Share this post[\s\S]*$/i, '')
    .trim()

  const frontmatter = {
    slug: post.slug,
    title: post.title,
    date: post.date,
    readTime: post.readTime,
    tags: post.tags,
    excerpt: post.excerpt,
    author: post.author,
    sourceUrl: post.sourceUrl,
    sourceName: post.sourceName,
  }

  const file = matter.stringify(markdown, frontmatter)
  await fs.mkdir(contentDir, { recursive: true })
  await fs.writeFile(path.join(contentDir, `${post.slug}.md`), file, 'utf8')
  console.log(`  saved ${post.slug}.md (${images.length} images)`)
}

await fs.mkdir(contentDir, { recursive: true })
await fs.mkdir(publicBlogDir, { recursive: true })

for (const post of POSTS) {
  await fetchPost(post)
}

console.log('Done.')
