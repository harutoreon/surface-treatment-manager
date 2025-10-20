import { test, expect } from '@playwright/test'

test.describe('一般ユーザーでログインした場合', () => {
  test('一般ユーザー専用のメインメニューが表示されること', async ({ page }) => {
    await page.goto('http://localhost:5173/')
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()

    await page.getByRole('radio', { name: '一般ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()

    await page.waitForResponse(response =>
      response.url().includes('/login') && response.status() === 200
    )

    await expect(page).toHaveURL('http://localhost:5173/home')
    await expect(page.getByRole('heading', { name: 'メインメニュー' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '処理名で検索' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'カテゴリーで検索' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'メーカー名で検索' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '処理一覧から検索' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'アプリケーションの管理' })).toBeVisible()

    await page.getByRole('button').click()  // 通知を閉じる
  })
})
