import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

const fillLoginForm = async (page: Page, username: string, password: string): Promise<void> => {
  await page.getByRole('textbox', { name: 'ユーザー名' }).fill(username)
  await page.getByRole('textbox', { name: 'パスワード' }).fill(password)
  await page.getByRole('button', { name: 'ログイン' }).click()
}

test.describe('header display flow', () => {
  test('ログインページは header が非表示であること', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Surface Treatment Manager' })).not.toBeVisible()
  })

  test('ホームページは header が表示されること', async ({ page }) => {
    await page.goto('/')
    await fillLoginForm(page, 'admin user', 'adminpassword')

    await page.waitForURL('/home')
    await expect(page).toHaveURL('/home')
    await expect(page.getByRole('heading', { name: 'メインメニュー' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Surface Treatment Manager' })).toBeVisible()
  })
})
