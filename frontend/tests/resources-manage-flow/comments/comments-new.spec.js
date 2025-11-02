import { test, expect } from '@playwright/test'

test.describe('comments new flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/comments/new')
  })

  test.describe('初期レンダリングに成功した場合', () => {
    test('コメント情報の新規登録ページが表示されること', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'コメント情報の新規登録' })).toBeVisible()

      await expect(page.locator('#commenter')).toBeVisible()
      await expect(page.locator('#departments')).toBeVisible()
      await expect(page.locator('#samples')).toBeVisible()
      await expect(page.locator('#body')).toBeVisible()

      await expect(page.getByRole('button', { name: '登録' })).toBeVisible()

      await expect(page.getByRole('link', { name: 'コメントリストへ' })).toBeVisible()
    })
  })

  test.describe('コメントリストのリンクをクリックした場合', () => {
    test('/commentsへ移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'コメントリストへ' }).click()

      await expect(page).toHaveURL('/comments')
      await expect(page.getByRole('heading', { name: 'コメントリスト' })).toBeVisible()
    })
  })
})
