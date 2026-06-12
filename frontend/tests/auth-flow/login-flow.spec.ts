import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

const fillLoginForm = async (page: Page, username: string, password: string): Promise<void> => {
  await page.getByRole('textbox', { name: 'ユーザー名' }).fill(username)
  await page.getByRole('textbox', { name: 'パスワード' }).fill(password)
  await page.getByRole('button', { name: 'ログイン' }).click()
}

test.describe('login-flow', () => {
  test.describe('有効なユーザー名とパスワードを入力した場合', () => {
    test('ログインに成功すること', async ({ page }) => {
      await page.goto('/')
      await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()

      await fillLoginForm(page, 'general user', 'generalpassword')

      await expect(page).toHaveURL('/home')
      await expect(page.getByRole('heading', { name: 'メインメニュー' })).toBeVisible()

      await expect(page.getByText('ログインしました。')).toBeVisible()
      await page.getByRole('button').click()
    })
  })

  test.describe('無効なユーザー名とパスワードを入力した場合', () => {
    test('ログインに失敗すること', async ({ page }) => {
      await page.goto('/')
      await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()

      await fillLoginForm(page, 'invalid user', 'invalidpassword')

      await expect(page).toHaveURL('/')
      await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()

      await expect(page.getByText('ユーザー名またはパスワードが無効です')).toBeVisible()
    })
  })
})
