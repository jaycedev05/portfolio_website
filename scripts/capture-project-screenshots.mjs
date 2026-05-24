import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'projects')

const targets = [
  {
    name: 'boompop',
    url: 'https://boompop.com/',
    waitMs: 4000,
  },
  {
    name: 'infinite-giving',
    url: 'https://www.infinitegiving.com/',
    waitMs: 4000,
  },
  {
    name: 'schoolai',
    url: 'https://schoolai.com/',
    waitMs: 4000,
  },
]

async function dismissOverlays(page) {
  const selectors = [
    'button:has-text("Accept")',
    'button:has-text("Accept All")',
    'button:has-text("Got it")',
    'button:has-text("Close")',
    '[aria-label="Close"]',
    '[data-testid="close"]',
  ]

  for (const selector of selectors) {
    const el = page.locator(selector).first()
    if (await el.isVisible({ timeout: 500 }).catch(() => false)) {
      await el.click({ timeout: 2000 }).catch(() => {})
    }
  }
}

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
    await page.goto(target.url, {
      waitUntil: target.name === 'infinite-giving' ? 'domcontentloaded' : 'networkidle',
      timeout: 90000,
    })
    await page.waitForTimeout(target.waitMs)
    await dismissOverlays(page)
    await page.waitForTimeout(1000)

    const filePath = path.join(outDir, `${target.name}.jpg`)
    await page.screenshot({
      path: filePath,
      type: 'jpeg',
      quality: 88,
      fullPage: false,
    })
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
