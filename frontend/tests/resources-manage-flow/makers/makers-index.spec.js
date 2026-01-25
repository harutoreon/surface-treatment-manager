import { test, expect } from '@playwright/test'

test.describe('makers index flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/makers')
  })

  test.describe('初期レンダリングに成功した場合', () => {
    test('メーカーリストページが表示されること', async ({ page }) => {
      await expect(page).toHaveURL('/makers')
      await expect(page.getByRole('heading', { name: 'メーカーリスト' })).toBeVisible()

      await expect(page.locator('a[href="/makers/1"]')).toBeVisible()
      await expect(page.locator('a[href="/makers/2"]')).toBeVisible()
      await expect(page.locator('a[href="/makers/3"]')).toBeVisible()
      await expect(page.locator('a[href="/makers/4"]')).toBeVisible()
      await expect(page.locator('a[href="/makers/5"]')).toBeVisible()
      await expect(page.locator('a[href="/makers/6"]')).toBeVisible()
      await expect(page.locator('a[href="/makers/7"]')).toBeVisible()

      await expect(page.getByRole('listitem').filter({ hasText: '前ページ' })).toBeVisible()
      await expect(page.getByRole('listitem').filter({ hasText: '次ページ' })).toBeVisible()

      await expect(page.getByRole('link', { name: 'メーカー情報の登録' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'メインメニューへ' })).toBeVisible()
    })
  })

  test.describe('メーカー情報の登録リンクをクリックした時', () => {
    test('/makers/newへ移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'メーカー情報の登録' }).click()

      await expect(page).toHaveURL('/makers/new')
      await expect(page.getByRole('heading', { name: 'メーカー情報の登録' })).toBeVisible()
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
