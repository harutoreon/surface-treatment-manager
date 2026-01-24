import { test, expect } from '@playwright/test'

test.describe('header display flow', () => {
  test('ログインページはheaderが非表示であること', async ({ page }) => {
    await page.goto('http://localhost:5173/')

    await expect(page).toHaveURL('http://localhost:5173/')
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Surface Treatment Manager' })).not.toBeVisible()
  })

  test('ログインページ以外はheaderが表示されること', async ({ page }) => {
    await page.goto('http://localhost:5173/')

    await page.getByRole('radio', { name: '一般ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()

    await expect(page).toHaveURL('http://localhost:5173/home')
    await expect(page.locator('p', { hasText: 'メインメニュー' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Surface Treatment Manager' })).toBeVisible()
  })
})
