import { test, expect } from '@playwright/test'

test.describe('表面処理名で検索', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('radio', { name: '一般ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()

    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.locator('#search-name').getByRole('link', { name: '検索ページへ' }).click()
  })

  test.describe('検索文字列「めっき」で検索した場合', () => {
    test('文字列「めっき」を含む表面処理がヒットすること', async ({ page }) => {
      await expect(page).toHaveURL('http://localhost:5173/static_pages/name')
      await expect(page.getByRole('heading', { name: '処理名で検索' })).toBeVisible()

      await page.getByRole('textbox', { name: 'キーワードをここに入力' }).fill('めっき')
      await page.getByRole('button', { name: '検索' }).click()

      await expect(page).toHaveURL(
        'http://localhost:5173/static_pages/name/search_results?keyword=めっき'
      )
      await expect(page.getByRole('heading', { name: '表面処理の検索結果' })).toBeVisible()
      await expect(page.getByRole('link', { name: '錫めっき' })).toBeVisible()
    })
  })

  test.describe('検索文字列「無効な検索文字列」で検索した場合', () => {
    test('該当する表面処理がないメッセージが表示されること', async ({ page }) => {
      await expect(page).toHaveURL('http://localhost:5173/static_pages/name')
      await expect(page.getByRole('heading', { name: '処理名で検索' })).toBeVisible()

      await page.getByRole('textbox', { name: 'キーワードをここに入力' }).fill('無効な検索文字列')
      await page.getByRole('button', { name: '検索' }).click()

      await expect(page).toHaveURL(
        'http://localhost:5173/static_pages/name/search_results?keyword=無効な検索文字列'
      )
      await expect(page.getByRole('heading', { name: '表面処理の検索結果' })).toBeVisible()
      await expect(page.getByRole('heading', { name: '該当する表面処理はありませんでした。' })).toBeVisible()
    })
  })

  test.describe('キーワードを未入力で検索した場合', () => {
    test('キーワード入力を促すメッセージが表示されること', async ({ page }) => {
      await expect(page).toHaveURL('http://localhost:5173/static_pages/name')
      await expect(page.getByRole('heading', { name: '処理名で検索' })).toBeVisible()

      await page.getByRole('textbox', { name: 'キーワードをここに入力' }).fill('')
      await page.getByRole('button', { name: '検索' }).click()

      await expect(page).toHaveURL('http://localhost:5173/static_pages/name')
      await expect(page.getByRole('heading', { name: '処理名で検索' })).toBeVisible()
      await expect(page.getByRole('alert')).toHaveText('キーワードが未入力です')
    })
  })
})