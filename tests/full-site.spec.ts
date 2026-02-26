import { test, expect } from '@playwright/test'

// ============================================================
// 1. Hero Page — Desktop & Mobile
// ============================================================
test.describe('Hero Page', () => {
  test('loads hero page with NavBar and content', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.hn-bar')).toBeVisible()
    await expect(page.locator('.hn-brand')).toBeVisible()
    await expect(page.locator('.theme-switch')).toBeVisible()
  })

  test('NavBar does not overflow horizontally', async ({ page }) => {
    await page.goto('/')
    const overflows = await page.evaluate(() => {
      const el = document.querySelector('.hn-inner')
      if (!el) return false
      return el.scrollWidth > el.clientWidth
    })
    expect(overflows).toBe(false)
  })
})

// ============================================================
// 2. NavBar Theme Toggle
// ============================================================
test.describe('NavBar Theme Toggle', () => {
  test('theme toggle switch is in header', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.theme-switch')).toBeVisible()
    await expect(page.locator('.theme-switch__checkbox')).toBeAttached()
  })

  test('clicking theme toggle changes checkbox state', async ({ page }) => {
    await page.goto('/')
    const sw = page.locator('.theme-switch')
    await expect(sw).toBeVisible()
    const before = await page.locator('.theme-switch__checkbox').isChecked()
    await sw.click()
    const after = await page.locator('.theme-switch__checkbox').isChecked()
    expect(before).not.toBe(after)
  })

  test('no old vmap-theme-toggle in venue page', async ({ page, isMobile }) => {
    await page.goto('/')
    if (isMobile) {
      // Use hamburger menu
      await page.locator('.hn-hamburger').click()
      await page.waitForTimeout(300)
      await page.locator('.hn-mobile-item', { hasText: '교육장 목록' }).click()
    } else {
      const venueMenu = page.locator('.hn-pill-wrap').nth(1)
      await venueMenu.hover()
      await page.waitForTimeout(300)
      await page.locator('.hn-drop-item', { hasText: '교육장 목록' }).click()
    }
    await page.waitForTimeout(1000)
    // Old toggles should not exist
    const oldToggles = page.locator('.vmap-theme-toggle')
    await expect(oldToggles).toHaveCount(0)
    // NavBar toggle should still be there
    await expect(page.locator('.theme-switch')).toBeVisible()
  })

  test('theme toggle applies body.light-theme globally', async ({ page }) => {
    await page.goto('/')
    // Default is dark — body should NOT have light-theme
    const hasLightBefore = await page.evaluate(() => document.body.classList.contains('light-theme'))
    expect(hasLightBefore).toBe(false)
    // Toggle to light
    await page.locator('.theme-switch').click()
    const hasLightAfter = await page.evaluate(() => document.body.classList.contains('light-theme'))
    expect(hasLightAfter).toBe(true)
    // Toggle back
    await page.locator('.theme-switch').click()
    const hasLightFinal = await page.evaluate(() => document.body.classList.contains('light-theme'))
    expect(hasLightFinal).toBe(false)
  })

  test('theme toggle affects venue page styling', async ({ page, isMobile }) => {
    await page.goto('/')
    if (isMobile) {
      await page.locator('.hn-hamburger').click()
      await page.waitForTimeout(300)
      await page.locator('.hn-mobile-item', { hasText: '교육장 목록' }).click()
    } else {
      const venueMenu = page.locator('.hn-pill-wrap').nth(1)
      await venueMenu.hover()
      await page.waitForTimeout(300)
      await page.locator('.hn-drop-item', { hasText: '교육장 목록' }).click()
    }
    await page.waitForTimeout(1000)
    const wrap = page.locator('.venue-page-wrap')
    await expect(wrap).not.toHaveClass(/venue-light/)
    // Toggle to light
    await page.locator('.theme-switch').click()
    await expect(wrap).toHaveClass(/venue-light/)
    // Toggle back
    await page.locator('.theme-switch').click()
    await expect(wrap).not.toHaveClass(/venue-light/)
  })

  test('NavBar changes color in light mode', async ({ page }) => {
    await page.goto('/')
    // Toggle to light
    await page.locator('.theme-switch').click()
    await page.waitForTimeout(300)
    // NavBar background should be light (white-ish)
    const navBg = await page.locator('.hn-bar').evaluate(el => getComputedStyle(el).backgroundColor)
    // Should NOT be the dark rgba(8,12,20,0.95)
    expect(navBg).not.toContain('8, 12, 20')
  })
})

// ============================================================
// 3. Venue Info Page
// ============================================================
test.describe('Venue Info Page', () => {
  test('venue page loads with map and cards', async ({ page, isMobile }) => {
    await page.goto('/')
    if (isMobile) {
      await page.locator('.hn-hamburger').click()
      await page.waitForTimeout(300)
      await page.locator('.hn-mobile-item', { hasText: '교육장 목록' }).click()
    } else {
      const venueMenu = page.locator('.hn-pill-wrap').nth(1)
      await venueMenu.hover()
      await page.waitForTimeout(300)
      await page.locator('.hn-drop-item', { hasText: '교육장 목록' }).click()
    }
    await page.waitForTimeout(2000)
    await expect(page.locator('.vmap-hero')).toBeVisible()
    await expect(page.locator('.vb2-grid')).toBeVisible()
    const cards = page.locator('.vb2-card')
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('venue card expansion works', async ({ page, isMobile }) => {
    await page.goto('/')
    if (isMobile) {
      await page.locator('.hn-hamburger').click()
      await page.waitForTimeout(300)
      await page.locator('.hn-mobile-item', { hasText: '교육장 목록' }).click()
    } else {
      const venueMenu = page.locator('.hn-pill-wrap').nth(1)
      await venueMenu.hover()
      await page.waitForTimeout(300)
      await page.locator('.hn-drop-item', { hasText: '교육장 목록' }).click()
    }
    await page.waitForTimeout(2000)
    await page.locator('.vb2-card').first().click()
    await page.waitForTimeout(500)
    await expect(page.locator('.vb2-detail')).toBeVisible()
  })
})

// ============================================================
// 4. Login Flow
// ============================================================
test.describe('Login Flow', () => {
  test('clicking 시스템 접속 navigates to login', async ({ page }) => {
    await page.goto('/')
    await page.locator('.hn-cta').click()
    await page.waitForTimeout(500)
    const loginEl = page.locator('.login-page, .login-container, form')
    await expect(loginEl.first()).toBeVisible()
  })
})

// ============================================================
// 5. Mobile Specific Tests
// ============================================================
test.describe('Mobile Layout', () => {
  test('NavBar elements fit within viewport', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.hn-bar')).toBeVisible()
    await expect(page.locator('.theme-switch')).toBeVisible()
    const overflows = await page.evaluate(() => {
      const el = document.querySelector('.hn-inner')
      if (!el) return false
      return el.scrollWidth > el.clientWidth
    })
    expect(overflows).toBe(false)
  })

  test('theme toggle is clickable', async ({ page }) => {
    await page.goto('/')
    const toggle = page.locator('.theme-switch')
    await expect(toggle).toBeVisible()
    const box = await toggle.boundingBox()
    expect(box).toBeTruthy()
    expect(box!.width).toBeGreaterThan(20)
    expect(box!.height).toBeGreaterThan(20)
    await toggle.click()
  })

  test('시스템 접속 button is visible', async ({ page }) => {
    await page.goto('/')
    const cta = page.locator('.hn-cta')
    await expect(cta).toBeVisible()
  })

  test('hero page does not overflow', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1000)
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(overflow).toBe(false)
  })

  test('venue page does not overflow', async ({ page, isMobile }) => {
    await page.goto('/')
    if (isMobile) {
      await page.locator('.hn-hamburger').click()
      await page.waitForTimeout(300)
      await page.locator('.hn-mobile-item', { hasText: '교육장 목록' }).click()
    } else {
      const venueMenu = page.locator('.hn-pill-wrap').nth(1)
      await venueMenu.hover()
      await page.waitForTimeout(300)
      await page.locator('.hn-drop-item', { hasText: '교육장 목록' }).click()
    }
    await page.waitForTimeout(2000)
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(overflow).toBe(false)
  })
})

// ============================================================
// 6. Mobile Hamburger Menu
// ============================================================
test.describe('Mobile Hamburger Menu', () => {
  test('hamburger is visible on mobile, hidden on desktop', async ({ page, isMobile }) => {
    await page.goto('/')
    const hamburger = page.locator('.hn-hamburger')
    if (isMobile) {
      await expect(hamburger).toBeVisible()
    } else {
      await expect(hamburger).not.toBeVisible()
    }
  })

  test('hamburger opens mobile menu with nav items', async ({ page, isMobile }) => {
    if (!isMobile) return
    await page.goto('/')
    // Menu should be hidden initially
    await expect(page.locator('.hn-mobile-menu')).not.toBeVisible()
    // Click hamburger
    await page.locator('.hn-hamburger').click()
    await page.waitForTimeout(300)
    // Menu should appear
    await expect(page.locator('.hn-mobile-menu')).toBeVisible()
    // Should have navigation items
    const items = page.locator('.hn-mobile-item')
    expect(await items.count()).toBeGreaterThan(0)
  })

  test('mobile menu item navigates correctly', async ({ page, isMobile }) => {
    if (!isMobile) return
    await page.goto('/')
    await page.locator('.hn-hamburger').click()
    await page.waitForTimeout(300)
    await page.locator('.hn-mobile-item', { hasText: '교육장 목록' }).click()
    await page.waitForTimeout(1000)
    // Should have navigated to venue page
    await expect(page.locator('.venue-page-wrap')).toBeVisible()
    // Mobile menu should be closed
    await expect(page.locator('.hn-mobile-menu')).not.toBeVisible()
  })
})

// ============================================================
// 7. Desktop Dropdown Menus
// ============================================================
test.describe('Desktop Dropdown Menus', () => {
  test('education menu opens on hover', async ({ page, isMobile }) => {
    if (isMobile) return
    await page.goto('/')
    const eduMenu = page.locator('.hn-pill-wrap').first()
    await eduMenu.hover()
    await page.waitForTimeout(300)
    await expect(page.locator('.hn-drop').first()).toBeVisible()
  })

  test('dropdown items are clickable', async ({ page, isMobile }) => {
    if (isMobile) return
    await page.goto('/')
    const eduMenu = page.locator('.hn-pill-wrap').first()
    await eduMenu.hover()
    await page.waitForTimeout(300)
    const items = page.locator('.hn-drop-item')
    expect(await items.count()).toBeGreaterThan(0)
  })

  test('pills are visible on desktop', async ({ page, isMobile }) => {
    if (isMobile) return
    await page.goto('/')
    await expect(page.locator('.hn-pills')).toBeVisible()
    const pills = page.locator('.hn-pill')
    await expect(pills).toHaveCount(5)
  })
})
