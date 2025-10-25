import { test, expect } from '@playwright/test'

test.describe('表面処理一覧で検索', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '一般ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.locator('#search-list').getByRole('link', { name: '検索ページへ' }).click()
  })

  test('表面処理が複数表示される', async ({ page }) => {
    await expect(page).toHaveURL('/list_search_results')
    await expect(page.getByRole('heading', { name: '表面処理一覧' })).toBeVisible()

    await expect(page.getByRole('heading', { name: '無電解ニッケルめっき' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '白金めっき' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '銀めっき' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '銅めっき' })).toBeVisible()
  })
})
