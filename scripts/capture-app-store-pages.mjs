import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'projects')

const targets = [
  {
    name: 'blip',
    url: 'https://apps.apple.com/us/app/blip-dont-just-post-host/id6477564661',
  },
  {
    name: 'toffy-ai',
    url: 'https://apps.apple.com/in/app/toffy-ai-dog-training-app/id6740557230',
  },
]

await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
})

for (const target of targets) {
  const page = await context.newPage()
  console.log(`Capturing ${target.url}...`)

  try {
    await page.goto(target.url, { waitUntil: 'networkidle', timeout: 90000 })
    await page.waitForTimeout(5000)

    const hero = page.locator('section[class*="shelf"]').first()
    const filePath = path.join(outDir, `${target.name}.png`)

    if (await hero.isVisible({ timeout: 3000 }).catch(() => false)) {
      await hero.screenshot({ path: filePath, type: 'jpeg', quality: 88 })
    } else {
      await page.screenshot({
        path: filePath,
        type: 'jpeg',
        quality: 88,
        fullPage: false,
      })
    }

    console.log(`Saved ${filePath}`)
  } catch (error) {
    console.error(`Failed ${target.name}:`, error.message)
    process.exitCode = 1
  } finally {
    await page.close()
  }
}

await browser.close()
console.log('Done.')
