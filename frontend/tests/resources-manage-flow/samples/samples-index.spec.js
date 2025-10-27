import { test, expect } from '@playwright/test'

test.describe('samples flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/samples')
  })

  test.describe('初期レンダリングに成功した場合', () => {
    test('表面処理リストが表示されること', async ({ page }) => {
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

  test.describe('表面処理情報の登録リンクをクリックした場合', () => {
    test('/samples/newへ移動すること', async ({ page }) => {
      await page.getByRole('link', { name: '表面処理情報の登録' }).click()

      await expect(page).toHaveURL('/samples/new')
      await expect(page.getByRole('heading', { name: '表面処理情報の登録' })).toBeVisible()
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
