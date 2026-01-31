import { test, expect } from '@playwright/test'

test.describe('検索結果に戻る機能のフロー', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '一般ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.locator('#search-name').getByRole('link', { name: '検索ページへ' }).click()
  })

  test.describe('表面処理情報ページで検索結果に戻るボタンを押したとき', () => {
    test('表面処理の検索結果ページに戻ること', async ({ page }) => {
      // キーワード：「めっき」で検索する
      await page.getByRole('textbox', { name: 'キーワードをここに入力' }).fill('めっき')
      await page.getByRole('button', { name: '検索' }).click()

      // 文字列「めっき」が含まれる表面処理の一覧が表示される
      await expect(page.getByRole('heading', { name: '表面処理の検索結果' })).toBeVisible()
      await expect(page.getByRole('link', { name: /.+めっき/ }).first()).toBeVisible()

      // 「無電解ニッケルめっき」のリンクをクリックして、表面処理情報ページに移動する
      await page.getByRole('link', { name: '無電解ニッケルめっき' }).click()
      await expect(page.getByRole('heading', { name: '表面処理情報' })).toBeVisible()
      await expect(page.getByText('無電解ニッケルめっき')).toBeVisible()

      // 「検索結果に戻る」ボタンを押す
      await page.getByRole('button', { name: '検索結果に戻る' }).click()

      // 前回の検索結果はそのままで表面処理の検索結果ページに移動する
      await expect(page.getByRole('heading', { name: '表面処理の検索結果' })).toBeVisible()
      await expect(page.getByRole('link', { name: /.+めっき/ }).first()).toBeVisible()
    })
  })
})
