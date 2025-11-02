import { test, expect } from '@playwright/test'

test.describe('departments index flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/departments')
  })

  test.describe('初期レンダリングに成功した場合', () => {
    test('部署リストページが表示されること', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '部署リスト' })).toBeVisible()

      await expect(page.locator('a[href="/departments/1"]')).toBeVisible()
      await expect(page.locator('a[href="/departments/2"]')).toBeVisible()
      await expect(page.locator('a[href="/departments/3"]')).toBeVisible()
      await expect(page.locator('a[href="/departments/4"]')).toBeVisible()
      
      await expect(page.getByRole('link', { name: '部署情報の登録へ' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'メインメニューへ' })).toBeVisible()
    })
  })

  test.describe('部署情報の登録リンクをクリックした時', () => {
    test('/departments/newへ移動すること', async ({ page }) => {
      await page.getByRole('link', { name: '部署情報の登録' }).click()

      await expect(page).toHaveURL('/departments/new')
      await expect(page.getByRole('heading', { name: '部署情報の登録' })).toBeVisible()
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
