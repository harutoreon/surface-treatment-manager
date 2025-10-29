import { test, expect } from '@playwright/test'

test.describe('categories index flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/categories')
  })

  test.describe('初期レンダリングに成功した場合', () => {
    test('カテゴリーリストページが表示されること', async ({ page }) => {
      await expect(page).toHaveURL('/categories')
      await expect(page.getByRole('heading', { name: 'カテゴリーリスト' })).toBeVisible()

      await expect(page.getByRole('link', { name: 'めっき' })).toBeVisible()
      await expect(page.getByRole('link', { name: '陽極酸化' })).toBeVisible()
      await expect(page.getByRole('link', { name: '化成' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'コーティング' })).toBeVisible()
      await expect(page.getByRole('link', { name: '表面硬化' })).toBeVisible()

      await expect(page.getByRole('link', { name: 'カテゴリー情報の登録' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'メインメニューへ' })).toBeVisible()
    })
  })

  test.describe('カテゴリー情報の登録リンクをクリックした時', () => {
    test('/categories/newへ移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'カテゴリー情報の登録' }).click()

      await expect(page).toHaveURL('/categories/new')
      await expect(page.getByRole('heading', { name: 'カテゴリー情報の登録' })).toBeVisible()
    })
  })

  test.describe('メインメニューへのリンクをクリックした場合', () => {
    test('/homeに移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'メインメニューへ' }).click()

      await expect(page).toHaveURL('/home')
      await expect(page.getByRole('heading', { name: 'メインメニュー' })).toBeVisible()
    })
  })
})
