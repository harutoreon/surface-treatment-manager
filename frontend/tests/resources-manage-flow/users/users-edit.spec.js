import { test, expect } from '@playwright/test'

test.describe('users edit flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/users/1/edit')
  })

  test.describe('初期レンダリングに成功した場合', () => {
    test('ユーザー情報の編集ページが表示されること', async ({ page }) => {
      await expect(page).toHaveURL('/users/1/edit')
      await expect(page.getByRole('heading', { name: 'ユーザー情報の編集' })).toBeVisible()

      await expect(page.locator('#user-name')).toBeVisible()
      await expect(page.locator('#user-department')).toBeVisible()
      await expect(page.locator('#user-password')).toBeVisible()
      await expect(page.locator('#user-password-confirmation')).toBeVisible()

      await expect(page.getByRole('button', { name: '更新' })).toBeVisible()

      await expect(page.getByRole('link', { name: 'ユーザー情報' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'ユーザーリスト' })).toBeVisible()
    })
  })

  test.describe('ユーザー情報のリンクをクリックした時', () => {
    test('/users/1に移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'ユーザー情報' }).click()

      await expect(page).toHaveURL('/users/1')
      await expect(page.getByRole('heading', { name: 'ユーザー情報' })).toBeVisible()
    })
  })

  test.describe('ユーザーリストへのリンクをクリックした時', () => {
    test('/usersに移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'ユーザーリスト' }).click()

      await expect(page).toHaveURL('/users')
      await expect(page.getByRole('heading', { name: 'ユーザーリスト' })).toBeVisible()
    })
  })
})
