import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

const fillLoginForm = async (page: Page, username: string, password: string): Promise<void> => {
  await page.getByRole('textbox', { name: 'ユーザー名' }).fill(username)
  await page.getByRole('textbox', { name: 'パスワード' }).fill(password)
  await page.getByRole('button', { name: 'ログイン' }).click()
}

test.describe('categories crud flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await fillLoginForm(page, 'admin user', 'adminpassword')
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/categories/new')
  })

  test('カテゴリーの新規登録・参照・更新・削除ができること', async ({ page }) => {
    // 登録ページへの遷移確認
    await expect(page.getByRole('heading', { name: 'カテゴリー情報の登録' })).toBeVisible()

    // カテゴリーと概要文の入力
    await page.locator('#category-item').fill('溶射')
    await page.locator('#category-summary').fill('溶融・軟化させた材料を表面に吹き付ける処理。')

    // 登録実行
    await page.getByRole('button', { name: '登録' }).click()

    // 詳細ページへの遷移確認
    await expect(page.getByRole('heading', { name: 'カテゴリー情報' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: '溶射' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: '溶融・軟化させた材料を表面に吹き付ける処理。' })).toBeVisible()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    // カテゴリー情報の編集ページへ
    await page.getByRole('link', { name: 'カテゴリー情報の編集' }).click()

    // 更新ページへの遷移確認
    await expect(page.getByRole('heading', { name: 'カテゴリー情報の編集' })).toBeVisible()
    await expect(page.locator('#category-item')).toHaveValue('溶射')
    await expect(page.locator('#category-summary')).toHaveValue(
      '溶融・軟化させた材料を表面に吹き付ける処理。'
    )

    // 概要文を変更
    await page.locator('#category-summary').fill('溶融・軟化させた材料を表面に吹き付ける処理のこと。')

    // 更新を実行
    await page.getByRole('button', { name: '更新' }).click()

    // 詳細ページへの遷移確認
    await expect(page.getByRole('heading', { name: 'カテゴリー情報' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: '溶射'})).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: '溶融・軟化させた材料を表面に吹き付ける処理のこと。' })).toBeVisible()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    // カテゴリーの削除実行
    page.once('dialog', async dialog => {
      await dialog.accept()
    })
    await page.locator('button', { hasText: 'カテゴリー情報の削除' }).click()

    // 一覧ページへの遷移確認
    await expect(page.getByRole('heading', { name: 'カテゴリーリスト' })).toBeVisible()
    await expect(page.getByText('溶射', { exact: true })).not.toBeVisible()
    await page.getByRole('button', { name: '通知を閉じる' }).click()
  })
})
