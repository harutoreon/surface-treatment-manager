import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

const fillLoginForm = async (page: Page, username: string, password: string): Promise<void> => {
  await page.getByRole('textbox', { name: 'ユーザー名' }).fill(username)
  await page.getByRole('textbox', { name: 'パスワード' }).fill(password)
  await page.getByRole('button', { name: 'ログイン' }).click()
}

test.describe('カテゴリーで検索', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await fillLoginForm(page, 'general user', 'generalpassword')
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.locator('#search-category').getByRole('link', { name: '検索ページへ' }).click()
  })

  test.describe('カテゴリを選択して検索した場合', () => {
    test('文字列を含む表面処理がヒットすること', async ({ page }) => {
      await page.getByRole('combobox').selectOption('めっき')
      await page.getByRole('button', { name: '検索' }).click()

      await expect(page).toHaveURL('/static_pages/category/search_results?keyword=めっき')
      await expect(page.getByRole('heading', { name: '表面処理の検索結果' })).toBeVisible()
      await expect(page.getByRole('link', { name: /.+めっき/ }).first()).toBeVisible()
    })
  })

  test.describe('カテゴリーを未選択で検索した場合', () => {
    test('カテゴリー選択を促すメッセージが表示されること', async ({ page }) => {
      await page.getByRole('combobox').selectOption('')
      await page.getByRole('button', { name: '検索' }).click()

      await expect(page).toHaveURL('/static_pages/category')
      await expect(page.getByRole('heading', { name: 'カテゴリーで検索' })).toBeVisible()
      await expect(page.getByRole('alert')).toHaveText('リスト内の項目を選択して下さい')
    })
  })
})
