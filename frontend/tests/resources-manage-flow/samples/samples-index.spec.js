import { test, expect } from '@playwright/test'

test.describe('samples flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.locator('#manage-samples').getByRole('link', { name: '管理ページへ' }).click()
  })

  test('表面処理リストページが表示されること', async ({ page }) => {
    await expect(page).toHaveURL('/samples')
    await expect(page.getByRole('heading', { name: '表面処理リスト' })).toBeVisible()

    await expect(page.getByRole('link', { name: '無電解ニッケルめっき' })).toBeVisible()
    await expect(page.getByRole('link', { name: '白金めっき' })).toBeVisible()
    await expect(page.getByRole('link', { name: '銀めっき' })).toBeVisible()
    await expect(page.getByRole('link', { name: '錫めっき' })).toBeVisible()

    await expect(page.locator('#pagination_previous_page')).toBeVisible()
    await expect(page.getByRole('link', { name: '1' })).toBeVisible()
    await expect(page.getByRole('link', { name: '次ページ' })).toBeVisible()

    await expect(page.getByRole('link', { name: '表面処理情報の登録' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'メインメニューへ' })).toBeVisible()
  })
})
