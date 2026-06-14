import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

const fillLoginForm = async (page: Page, username: string, password: string): Promise<void> => {
  await page.getByRole('textbox', { name: 'ユーザー名' }).fill(username)
  await page.getByRole('textbox', { name: 'パスワード' }).fill(password)
  await page.getByRole('button', { name: 'ログイン' }).click()
}

test.describe('users crud flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await fillLoginForm(page, 'admin user', 'adminpassword')
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/users/new')
  })

  test('ユーザーの新規登録・参照・更新・削除ができること', async ({ page }) => {
    // 登録ページの遷移確認
    await expect(page.getByRole('heading', { name: 'ユーザー情報の登録' })).toBeVisible()

    // ユーザー情報の入力
    await page.locator('#user-name').fill('森 はじめ')
    await page.locator('#user-department').selectOption('製造部')
    await page.locator('#user-password').fill('foobar')
    await page.locator('#user-password-confirmation').fill('foobar')

    // 登録実行
    await page.getByRole('button', { name: '登録' }).click()

    // 詳細ページへの遷移確認
    await expect(page.getByRole('heading', { name: 'ユーザー情報' })).toBeVisible()

    await expect(page.getByRole('listitem').filter({ hasText: '森 はじめ' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: '製造部' })).toBeVisible()

    await page.getByRole('button', { name: '通知を閉じる' }).click()

    // ユーザー情報の編集ページへ
    await page.getByRole('link', { name: 'ユーザー情報の編集' }).click()

    // 更新ページへの遷移確認
    await expect(page.getByRole('heading', { name: 'ユーザー情報の編集' })).toBeVisible()
    await expect(page.locator('#user-name')).toHaveValue('森 はじめ')
    await expect(page.locator('#user-department')).toHaveValue('製造部')

    // 部署名を変更
    await page.locator('#user-department').fill('営業部')

    // 更新を実行
    await page.getByRole('button', { name: '更新' }).click()

    // 詳細ページへの遷移確認
    await expect(page.getByRole('heading', { name: 'ユーザー情報' })).toBeVisible()

    await expect(page.getByRole('listitem').filter({ hasText: '森 はじめ' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: '営業部' })).toBeVisible()

    await page.getByRole('button', { name: '通知を閉じる' }).click()

    // ユーザー情報の削除実行
    page.once('dialog', async dialog => {
      await dialog.accept()
    })
    await page.getByRole('button', { name: 'ユーザーの削除' }).click()

    // 一覧ページへの遷移確認
    await expect(page.getByRole('heading', { name: 'ユーザーリスト' })).toBeVisible()
    await page.getByRole('button', { name: '通知を閉じる' }).click()
  })
})
