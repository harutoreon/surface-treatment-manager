import { test, expect } from '@playwright/test'

test.describe('users new flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/users/new')
  })

  test.describe('初期レンダリングに成功した場合', () => {
    test('ユーザー情報の登録ページが表示されること', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'ユーザー情報の登録' })).toBeVisible()

      await expect(page.locator('#user-name')).toBeVisible()
      await expect(page.locator('#user-department')).toBeVisible()
      await expect(page.locator('#user-password')).toBeVisible()
      await expect(page.locator('#user-password-confirmation')).toBeVisible()

      await expect(page.getByRole('button', { name: '登録' })).toBeVisible()

      await expect(page.getByRole('link', { name: 'ユーザーリスト' })).toBeVisible()
    })
  })

  test.describe('ユーザーリストのリンクをクリックした場合', () => {
    test('/usersへ移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'ユーザーリスト' }).click()

      await expect(page).toHaveURL('/users')
      await expect(page.getByRole('heading', { name: 'ユーザーリスト' })).toBeVisible()
    })
  })
})