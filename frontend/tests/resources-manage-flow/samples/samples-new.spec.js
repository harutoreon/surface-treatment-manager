import { test, expect } from '@playwright/test'

test.describe('samples new flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()
  })

  test.describe('/samples/newをリクエストした場合', () => {
    test('表面処理情報の登録ページが表示されること', async ({ page }) => {
      await page.goto('/samples/new')
      await expect(page.getByRole('heading', { name: '表面処理情報の登録' })).toBeVisible()

      await expect(page.locator('#sample-name')).toBeVisible()
      await expect(page.locator('#sample-category')).toBeVisible()
      await expect(page.locator('#sample-color')).toBeVisible()
      await expect(page.locator('#sample-maker')).toBeVisible()
      await expect(page.locator('#sample-hardness')).toBeVisible()
      await expect(page.locator('#sample-film-thickness')).toBeVisible()
      await expect(page.locator('#sample-feature')).toBeVisible()
      await expect(page.locator('#sample-summary')).toBeVisible()
      await expect(page.locator('#preview-image')).toBeVisible()
      await expect(page.locator('#sample-image')).toBeVisible()
      await expect(page.getByRole('button', { name: '登録' })).toBeVisible()

      await expect(page.getByRole('link', { name: '表面処理リストへ' })).toBeVisible()
    })
  })
})