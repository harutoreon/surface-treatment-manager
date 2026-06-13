import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

const fillLoginForm = async (page: Page, username: string, password: string): Promise<void> => {
  await page.getByRole('textbox', { name: 'ユーザー名' }).fill(username)
  await page.getByRole('textbox', { name: 'パスワード' }).fill(password)
  await page.getByRole('button', { name: 'ログイン' }).click()
}

test.describe('ログアウトフロー', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await fillLoginForm(page, 'general user', 'generalpassword')
    await page.getByRole('button', { name: '通知を閉じる' }).click()
  })

  test.describe('ログアウトのアラートでOKを押した場合', () => {
    test('ログインページに移動すること', async ({ page }) => {
      await page.getByRole('link', { name: '管理ページへ' }).click()

      await expect(page).toHaveURL('/settings')
      await expect(page.locator('p', { hasText: 'アプリケーションの管理' })).toBeVisible()

      page.once('dialog', async dialog => {
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'ログアウト' }).click()

      await expect(page).toHaveURL('/')
      await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()
    })
  })

  test.describe('ログアウトのアラートでキャンセルを押した場合', () => {
    test('アプリケーションの管理ページに留まること', async ({ page }) => {
      await page.getByRole('link', { name: '管理ページへ' }).click()

      await expect(page).toHaveURL('/settings')
      await expect(page.locator('p', { hasText: 'アプリケーションの管理' })).toBeVisible()

      page.once('dialog', async dialog => {
        await dialog.dismiss()
      })

      await page.getByRole('button', { name: 'ログアウト' }).click()

      await expect(page).toHaveURL('/settings')
      await expect(page.locator('p', { hasText: 'アプリケーションの管理' })).toBeVisible()
    })
  })
})
