import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

const fillLoginForm = async (page: Page, username: string, password: string): Promise<void> => {
  await page.getByRole('textbox', { name: 'ユーザー名' }).fill(username)
  await page.getByRole('textbox', { name: 'パスワード' }).fill(password)
  await page.getByRole('button', { name: 'ログイン' }).click()
}

test.describe('メーカー名で検索', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await fillLoginForm(page, 'general user', 'generalpassword')
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.locator('#search-maker').getByRole('link', { name: '検索ページへ' }).click()
  })

  test.describe('選択したメーカーで検索した場合', () => {
    test('メーカーに属する表面処理がヒットすること', async ({ page }) => {
      await page.getByRole('textbox', { name: 'キーワードをここに入力' }).fill('株式会社')
      await page.getByText('東亜電化工業株式会社').click()
      await page.getByRole('button', { name: '検索' }).click()

      await expect(page).toHaveURL('/static_pages/maker/search_results?keyword=東亜電化工業株式会社')
      await expect(page.getByRole('heading', { name: '表面処理の検索結果' })).toBeVisible()
      await expect(page.locator('div.fs-5', { hasText: '東亜電化工業株式会社' })).toBeVisible()
    })
  })

  test.describe('メーカーを未選択で検索した場合', () => {
    test('キーワード入力を促すメッセージが表示されること', async ({ page }) => {
      await page.getByRole('textbox', { name: 'キーワードをここに入力' }).fill('')
      await page.getByRole('button', { name: '検索' }).click()

      await expect(page).toHaveURL('/static_pages/maker')
      await expect(page.getByRole('heading', { name: 'メーカー名で検索' })).toBeVisible()
      await expect(page.getByRole('alert')).toHaveText('キーワードが未入力です')
    })
  })
})