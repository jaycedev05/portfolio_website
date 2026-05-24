import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'projects')

const apps = [
  { name: 'asl-flurry', id: '1659464785' },
  { name: 'blip', id: '6477564661' },
  { name: 'toffy-ai', id: '6740557230' },
]

function toHiResScreenshot(url) {
  return url.replace(/\/\d+x\d+bb\.(png|jpg)/i, '/1290x2796bb.jpg')
}

async function lookupApp(id) {
  const res = await fetch(`https://itunes.apple.com/lookup?id=${id}&country=us`)
  if (!res.ok) throw new Error(`lookup failed for ${id}: ${res.status}`)
  const data = await res.json()
  const app = data.results?.[0]
  if (!app) throw new Error(`no results for ${id}`)
  return app
}

async function downloadImage(url, filePath) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`download failed ${url}: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  await writeFile(filePath, buffer)
}

await mkdir(outDir, { recursive: true })

for (const app of apps) {
  console.log(`Fetching ${app.name} (id ${app.id})...`)
  try {
    const meta = await lookupApp(app.id)
    const screenshot = meta.screenshotUrls?.[0] ?? meta.ipadScreenshotUrls?.[0]
    const source = screenshot ? toHiResScreenshot(screenshot) : meta.artworkUrl512?.replace('512x512', '1024x1024')
    if (!source) throw new Error('no screenshots or artwork in iTunes metadata')

    const filePath = path.join(outDir, `${app.name}.png`)
    await downloadImage(source, filePath)
    console.log(`Saved ${filePath}`)
  } catch (error) {
    console.error(`Failed ${app.name}:`, error.message)
    process.exitCode = 1
  }
}

console.log('Done.')
