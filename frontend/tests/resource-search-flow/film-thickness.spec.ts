import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

const fillLoginForm = async (page: Page, username: string, password: string): Promise<void> => {
  await page.getByRole('textbox', { name: 'ユーザー名' }).fill(username)
  await page.getByRole('textbox', { name: 'パスワード' }).fill(password)
  await page.getByRole('button', { name: 'ログイン' }).click()
}

test.describe('Film Thickness Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await fillLoginForm(page, 'general user', 'generalpassword')
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.locator('#search-film-thickness').getByRole('link', { name: '検索ページへ' }).click()
  })

  test('変寸量で検索ページで膜厚と誤差を入力して検索すると、表面処理の検索結果ページに遷移する', async ({ page }) => {
    // 遷移先の見出し確認
    await page.waitForURL('/static_pages/film_thickness')
    await expect(page.getByRole('heading', { name: '変寸量で検索' })).toBeVisible()

    // 膜厚と誤差を入力して検索ボタンを押す
    await page.locator('#film-thickness').fill('5')
    await page.locator('#allowable-error').fill('2')
    await page.getByRole('button', { name: '検索' }).click()

    // 遷移先の見出し確認
    await page.waitForURL('/static_pages/film_thickness/search_results?min_film_thickness=3&max_film_thickness=7')
    await expect(page.getByRole('heading', { name: '表面処理の検索結果' })).toBeVisible()
  })

  test('変寸量で検索ページで膜厚または誤差を未入力で検索すると、バリデーションエラーになる', async ({ page }) => {
    // 遷移先の見出し確認
    await page.waitForURL('/static_pages/film_thickness')
    await expect(page.getByRole('heading', { name: '変寸量で検索' })).toBeVisible()

    // 膜厚と誤差を入力せずにそのまま検索ボタンを押す
    await expect(page.locator('#film-thickness')).toHaveText('')
    await expect(page.locator('#allowable-error')).toHaveText('')
    await page.getByRole('button', { name: '検索' }).click()

    // バリデーションエラーメッセージの表示確認
    await expect(page.locator('.alert')).toHaveText('変寸量または誤差を入力して下さい。')
  })
})
