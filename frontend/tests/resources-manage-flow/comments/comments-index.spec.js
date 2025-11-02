import { test, expect } from '@playwright/test'

test.describe('comments index flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/comments')
  })

  test.describe('初期レンダリングに成功した場合', () => {
    test('コメントリストページが表示されること', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'コメントリスト' })).toBeVisible()

      await expect(page.locator('a[href="/comments/1"]')).toBeVisible()
      await expect(page.locator('a[href="/comments/2"]')).toBeVisible()
      await expect(page.locator('a[href="/comments/3"]')).toBeVisible()
      await expect(page.locator('a[href="/comments/4"]')).toBeVisible()
      await expect(page.locator('a[href="/comments/5"]')).toBeVisible()
      await expect(page.locator('a[href="/comments/6"]')).toBeVisible()
      await expect(page.locator('a[href="/comments/7"]')).toBeVisible()
      await expect(page.locator('a[href="/comments/8"]')).toBeVisible()
      await expect(page.locator('a[href="/comments/9"]')).toBeVisible()
      await expect(page.locator('a[href="/comments/10"]')).toBeVisible()

      await expect(page.getByRole('listitem').filter({ hasText: '前ページ' })).toBeVisible()
      await expect(page.getByRole('listitem').filter({ hasText: '次ページ' })).toBeVisible()

      await expect(page.getByRole('link', { name: 'コメントの新規登録へ' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'メインメニューへ' })).toBeVisible()
    })
  })

  test.describe('次ページのリンクを押した時', () => {
    test('2ページ目のコメントリストが表示されること', async ({ page }) => {
      await page.getByRole('link', { name: '次ページ' }).click()

      await expect(page.locator('a[href="/comments/11"]')).toBeVisible()
      await expect(page.locator('a[href="/comments/20"]')).toBeVisible()
    })
  })

  test.describe('コメントの新規登録リンクをクリックした時', () => {
    test('/comments/newへ移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'コメントの新規登録へ' }).click()

      await expect(page).toHaveURL('/comments/new')
      await expect(page.getByRole('heading', { name: 'コメント情報の新規登録' })).toBeVisible()
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
