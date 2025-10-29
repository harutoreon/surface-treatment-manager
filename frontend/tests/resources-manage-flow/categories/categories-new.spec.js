import { test, expect } from '@playwright/test'

test.describe('categories new flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/categories/new')
  })

  test.describe('初期レンダリングに成功した場合', () => {
    test('カテゴリー情報の登録ページが表示されること', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'カテゴリー情報の登録' })).toBeVisible()

      await expect(page.locator('#category-item')).toBeVisible()
      await expect(page.locator('#category-summary')).toBeVisible()

      await expect(page.getByRole('button', { name: '登録' })).toBeVisible()

      await expect(page.getByRole('link', { name: 'カテゴリーリストへ' })).toBeVisible()
    })
  })

  test.describe('カテゴリーリストへのリンクをクリックした場合', () => {
    test('/categoriesへ移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'カテゴリーリストへ' }).click()

      await expect(page).toHaveURL('/categories')
      await expect(page.getByRole('heading', { name: 'カテゴリーリスト' })).toBeVisible()
    })
  })
})