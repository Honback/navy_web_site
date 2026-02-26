import { test } from '@playwright/test'

const BASE = 'http://localhost:3000'
const ADMIN_EMAIL = 'kjt@parancompany.co.kr'
const USER_EMAIL = 'kim.dh@navy.mil.kr'

async function loginAs(page: any, email: string) {
  await page.goto(BASE)
  await page.click('text=시스템 접속')
  await page.waitForSelector('input[type="email"]')
  await page.fill('input[type="email"]', email)
  await page.click('button[type="submit"]')
  await page.waitForTimeout(1500)
}

test.describe('Screenshot Review', () => {
  // Desktop 1440px - admin
  test('desktop 1440 - admin pages', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await ctx.newPage()

    await loginAs(page, ADMIN_EMAIL)
    await page.screenshot({ path: 'tests/screenshots/01-admin-home-1440.png', fullPage: true })

    await page.click('text=요청 관리')
    await page.waitForTimeout(800)
    await page.screenshot({ path: 'tests/screenshots/02-req-mgmt-1440.png', fullPage: true })

    const item = page.locator('.rm-item').first()
    if (await item.isVisible()) {
      await item.click()
      await page.waitForTimeout(500)
      await page.screenshot({ path: 'tests/screenshots/03-req-detail-1440.png', fullPage: true })
    }

    // Sidebar collapsed
    const toggle = page.locator('.sidebar-toggle')
    if (await toggle.isVisible()) {
      await toggle.click()
      await page.waitForTimeout(400)
      await page.screenshot({ path: 'tests/screenshots/03b-sidebar-collapsed-1440.png', fullPage: true })
    }

    await ctx.close()
  })

  // Desktop 1024px - admin
  test('desktop 1024 - admin request mgmt', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 } })
    const page = await ctx.newPage()

    await loginAs(page, ADMIN_EMAIL)
    await page.click('text=요청 관리')
    await page.waitForTimeout(800)
    await page.screenshot({ path: 'tests/screenshots/04-req-mgmt-1024.png', fullPage: true })

    const item = page.locator('.rm-item').first()
    if (await item.isVisible()) {
      await item.click()
      await page.waitForTimeout(500)
      await page.screenshot({ path: 'tests/screenshots/05-req-detail-1024.png', fullPage: true })
    }

    await ctx.close()
  })

  // Desktop 800px - narrow window
  test('desktop 800 - narrow window', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 800, height: 600 } })
    const page = await ctx.newPage()

    await loginAs(page, ADMIN_EMAIL)
    await page.click('text=요청 관리')
    await page.waitForTimeout(800)
    await page.screenshot({ path: 'tests/screenshots/06-req-mgmt-800.png', fullPage: true })

    const item = page.locator('.rm-item').first()
    if (await item.isVisible()) {
      await item.click()
      await page.waitForTimeout(500)
      await page.screenshot({ path: 'tests/screenshots/07-req-detail-800.png', fullPage: true })
    }

    await ctx.close()
  })

  // Mobile 393px
  test('mobile 393 - admin request mgmt', async ({ browser }) => {
    const ctx = await browser.newContext({
      viewport: { width: 393, height: 851 },
      userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36'
    })
    const page = await ctx.newPage()

    await loginAs(page, ADMIN_EMAIL)
    await page.screenshot({ path: 'tests/screenshots/08-admin-home-mobile.png', fullPage: true })

    await page.click('text=요청 관리')
    await page.waitForTimeout(800)
    await page.screenshot({ path: 'tests/screenshots/09-req-mgmt-mobile.png', fullPage: true })

    const item = page.locator('.rm-item').first()
    if (await item.isVisible()) {
      await item.click()
      await page.waitForTimeout(500)
      await page.screenshot({ path: 'tests/screenshots/10-req-detail-mobile.png', fullPage: true })
    }

    await ctx.close()
  })

  // Dark theme desktop
  test('desktop dark 1440 - request mgmt', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await ctx.newPage()

    await loginAs(page, ADMIN_EMAIL)

    // Ensure dark theme
    const hasLight = await page.locator('body').evaluate((el: HTMLElement) => el.classList.contains('light-theme'))
    if (hasLight) {
      await page.locator('.theme-switch').click()
      await page.waitForTimeout(300)
    }

    await page.click('text=요청 관리')
    await page.waitForTimeout(800)
    await page.screenshot({ path: 'tests/screenshots/11-req-mgmt-dark-1440.png', fullPage: true })

    const item = page.locator('.rm-item').first()
    if (await item.isVisible()) {
      await item.click()
      await page.waitForTimeout(500)
      await page.screenshot({ path: 'tests/screenshots/12-req-detail-dark-1440.png', fullPage: true })
    }

    await ctx.close()
  })

  // User view - request list
  test('desktop 1440 - user request list', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await ctx.newPage()

    await loginAs(page, USER_EMAIL)
    await page.click('text=내 요청 목록')
    await page.waitForTimeout(800)
    await page.screenshot({ path: 'tests/screenshots/13-user-reqlist-1440.png', fullPage: true })

    await ctx.close()
  })

  // Light theme desktop
  test('desktop light 1440 - request mgmt', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await ctx.newPage()

    await loginAs(page, ADMIN_EMAIL)

    // Switch to light theme
    const hasLight = await page.locator('body').evaluate((el: HTMLElement) => el.classList.contains('light-theme'))
    if (!hasLight) {
      await page.locator('.theme-switch').click()
      await page.waitForTimeout(300)
    }

    await page.click('text=요청 관리')
    await page.waitForTimeout(800)
    await page.screenshot({ path: 'tests/screenshots/14-req-mgmt-light-1440.png', fullPage: true })

    const item = page.locator('.rm-item').first()
    if (await item.isVisible()) {
      await item.click()
      await page.waitForTimeout(500)
      await page.screenshot({ path: 'tests/screenshots/15-req-detail-light-1440.png', fullPage: true })
    }

    await ctx.close()
  })
})
