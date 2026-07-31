import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test'

const fillLoginForm = async (page: Page, username: string, password: string): Promise<void> => {
  await page.getByRole('textbox', { name: 'ユーザー名' }).fill(username)
  await page.getByRole('textbox', { name: 'パスワード' }).fill(password)
  await page.getByRole('button', { name: 'ログイン' }).click()
}

test.describe('Image Size', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await fillLoginForm(page, 'admin user', 'adminpassword')
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/samples/1')
  })

  test('画像が元サイズに関わらず 250×250 で表示される', async ({ page }) => {
    const image = page.locator('#sample_image')
    const box = await image.boundingBox()

    expect(box?.width).toBe(250)
    expect(box?.height).toBe(250)
  })
})
