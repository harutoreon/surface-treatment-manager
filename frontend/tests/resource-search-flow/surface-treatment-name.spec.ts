import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

const fillLoginForm = async (page: Page, username: string, password: string): Promise<void> => {
  await page.getByRole('textbox', { name: 'ユーザー名' }).fill(username)
  await page.getByRole('textbox', { name: 'パスワード' }).fill(password)
  await page.getByRole('button', { name: 'ログイン' }).click()
}

test.describe('表面処理名で検索', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    await fillLoginForm(page, 'general user', 'generalpassword')
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.locator('#search-name').getByRole('link', { name: '検索ページへ' }).click()
  })

  test.describe('有効な文字列で検索した場合', () => {
    test('文字列を含む表面処理がヒットすること', async ({ page }) => {
      await page.getByRole('textbox', { name: 'キーワードをここに入力' }).fill('めっき')
      await page.getByRole('button', { name: '検索' }).click()

      await expect(page).toHaveURL('/static_pages/name/search_results?keyword=めっき')
      await expect(page.getByRole('heading', { name: '表面処理の検索結果' })).toBeVisible()
      await expect(page.getByRole('link', { name: /.+めっき/ }).first()).toBeVisible()
    })
  })

  test.describe('無効な検索文字列で検索した場合', () => {
    test('該当する表面処理がないメッセージが表示されること', async ({ page }) => {
      await page.getByRole('textbox', { name: 'キーワードをここに入力' }).fill('無効な検索文字列')
      await page.getByRole('button', { name: '検索' }).click()

      await expect(page).toHaveURL('/static_pages/name/search_results?keyword=無効な検索文字列')
      await expect(page.getByRole('heading', { name: '表面処理の検索結果' })).toBeVisible()
      await expect(page.locator('div.fs-4', { hasText: '該当する表面処理はありませんでした。' })).toBeVisible()
    })
  })
})
