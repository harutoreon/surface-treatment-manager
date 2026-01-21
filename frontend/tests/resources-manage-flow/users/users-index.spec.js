import { test, expect } from '@playwright/test'

test.describe('users index flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/users')
  })

  test.describe('初期レンダリングに成功した場合', () => {
    test('ユーザーリストページが表示されること', async ({ page }) => {
      await expect(page).toHaveURL('/users')
      await expect(page.getByRole('heading', { name: 'ユーザーリスト' })).toBeVisible()

      await expect(page.locator('a[href="/users/1"]')).toBeVisible()
      await expect(page.locator('a[href="/users/2"]')).toBeVisible()
      await expect(page.locator('a[href="/users/3"]')).toBeVisible()
      await expect(page.locator('a[href="/users/4"]')).toBeVisible()
      await expect(page.locator('a[href="/users/5"]')).toBeVisible()
      await expect(page.locator('a[href="/users/6"]')).toBeVisible()
      await expect(page.locator('a[href="/users/7"]')).toBeVisible()
      await expect(page.locator('a[href="/users/8"]')).toBeVisible()
      await expect(page.locator('a[href="/users/9"]')).toBeVisible()
      await expect(page.locator('a[href="/users/10"]')).toBeVisible()

      await expect(page.getByRole('listitem').filter({ hasText: '前ページ' })).toBeVisible()
      await expect(page.getByRole('listitem').filter({ hasText: '次ページ' })).toBeVisible()

      await expect(page.getByRole('link', { name: 'ユーザー情報の登録' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'メインメニューへ' })).toBeVisible()
    })
  })

  test.describe('次ページのリンクを押した時', () => {
    test('2ページ目のユーザーリストが表示されること', async ({ page }) => {
      await page.getByRole('link', { name: '次ページ' }).click()

      await expect(page.locator('a[href="/users/11"]')).toBeVisible()
      await expect(page.locator('a[href="/users/20"]')).toBeVisible()
    })
  })

  test.describe('ユーザー情報の登録リンクをクリックした時', () => {
    test('/users/newへ移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'ユーザー情報の登録' }).click()

      await expect(page).toHaveURL('/users/new')
      await expect(page.getByRole('heading', { name: 'ユーザー情報の登録' })).toBeVisible()
    })
  })

  test.describe('メインメニューへのリンクをクリックした場合', () => {
    test('/homeに移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'メインメニューへ' }).click()

      await expect(page).toHaveURL('/home')
      await expect(page.locator('p', { hasText: 'メインメニュー' })).toBeVisible()
    })
  })
})