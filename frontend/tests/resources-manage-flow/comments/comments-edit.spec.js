import { test, expect } from '@playwright/test'

test.describe('comments edit flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/comments/1/edit')
  })

  test.describe('初期レンダリングに成功した場合', () => {
    test('コメント情報の編集ページが表示されること', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'コメント情報の編集' })).toBeVisible()

      await expect(page.locator('#department')).toBeVisible()
      await expect(page.locator('#commenter')).toBeVisible()
      await expect(page.locator('#body')).toBeVisible()

      await expect(page.getByRole('button', { name: '更新' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'キャンセル' })).toBeVisible()
    })
  })

  test.describe('キャンセルボタンを押した場合', () => {
    test('コメント情報ページに移動すること', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'キャンセル' })).toBeVisible()

      await page.getByRole('button', { name: 'キャンセル' }).click()

      await expect(page).toHaveURL('/comments/1')
      await expect(page.getByRole('heading', { name: 'コメント情報' })).toBeVisible()
    })
  })
})
