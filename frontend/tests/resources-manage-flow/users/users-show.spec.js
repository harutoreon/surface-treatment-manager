import { test, expect } from '@playwright/test'

test.describe('users show flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/users/1')
  })

  test.describe('初期レンダリングに成功した時', () => {
    test('メーカー情報ページが表示されること', async ({ page }) => {
      await expect(page).toHaveURL('/users/1')
      await expect(page.getByRole('heading', { name: 'ユーザー情報' })).toBeVisible()

      await expect(page.getByRole('listitem')).toHaveText(
        [
          /ユーザー名：/,
          /部署名：/,
        ]
      )

      await expect(page.getByRole('link', { name: 'ユーザー情報の編集' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'ユーザーリスト' })).toBeVisible()
      await expect(page.locator('p', { hasText: 'ユーザーの削除' })).toBeVisible()
    })
  })

  test.describe('ユーザーリストのリンクをクリックした時', () => {
    test('/usersに移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'ユーザーリスト' }).click()

      await expect(page).toHaveURL('/users')
      await expect(page.getByRole('heading', { name: 'ユーザーリスト' })).toBeVisible()
    })
  })
})
