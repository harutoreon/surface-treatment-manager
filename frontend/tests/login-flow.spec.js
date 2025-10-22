import { test, expect } from '@playwright/test'

test.describe('一般ユーザーでログインした場合', () => {
  test('一般ユーザー専用のメインメニューが表示されること', async ({ page }) => {
    await page.goto('http://localhost:5173/')
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()

    await page.getByRole('radio', { name: '一般ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()

    await expect(page).toHaveURL('http://localhost:5173/home')
    await expect(page.getByRole('heading', { name: 'メインメニュー' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '処理名で検索' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'カテゴリーで検索' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'メーカー名で検索' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '処理一覧から検索' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'アプリケーションの管理' })).toBeVisible()

    await expect(page.getByText('ログインしました。')).toBeVisible()
    await page.getByRole('button').click()  // 通知を閉じる
  })
})

test.describe('管理者ユーザーでログインした場合', () => {
  test('管理者ユーザー専用のメインメニューが表示されること', async ({ page }) => {
    await page.goto('http://localhost:5173/')
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()

    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()

    await expect(page).toHaveURL('http://localhost:5173/home')
    await expect(page.getByRole('heading', { name: 'メインメニュー' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '表面処理の管理' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'カテゴリーの管理' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'メーカーの管理' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'ユーザーの管理' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '部署の管理' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'コメントの管理' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'アプリケーションの管理' })).toBeVisible()

    await expect(page.getByText('ログインしました。')).toBeVisible()
    await page.getByRole('button').click()  // 通知を閉じる
  })
})

test.describe('有効なユーザー名とパスワードを入力してログインした場合', () => {
  test('ログインに成功すること', async ({ page }) => {
    await page.goto('http://localhost:5173/')
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()

    await page.getByRole('textbox', { name: 'ユーザー名' }).fill('general user')
    await page.getByRole('textbox', { name: 'パスワード' }).fill('generalpassword')
    await page.getByRole('button', { name: 'ログイン' }).click()

    await expect(page).toHaveURL('http://localhost:5173/home')
    await expect(page.getByRole('heading', { name: 'メインメニュー' })).toBeVisible()

    await expect(page.getByText('ログインしました。')).toBeVisible()
    await page.getByRole('button').click()
  })
})