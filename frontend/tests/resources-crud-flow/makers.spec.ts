import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

const fillLoginForm = async (page: Page, username: string, password: string): Promise<void> => {
  await page.getByRole('textbox', { name: 'ユーザー名' }).fill(username)
  await page.getByRole('textbox', { name: 'パスワード' }).fill(password)
  await page.getByRole('button', { name: 'ログイン' }).click()
}

test.describe('makers crud flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await fillLoginForm(page, 'admin user', 'adminpassword')
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/makers/new')
  })

  test('メーカーの新規登録・参照・更新・削除ができること', async ({ page }) => {
    // 登録ページへの遷移確認
    await expect(page.getByRole('heading', { name: 'メーカー情報の登録' })).toBeVisible()

    // メーカー情報の入力
    await page.locator('#maker-name').fill('合資会社藤原印刷')
    await page.locator('#maker-postal-code').fill('262-0044')
    await page.locator('#maker-address').fill('東京都渋谷区神南1-2-37')
    await page.locator('#maker-phone-number').fill('070-4207-7874')
    await page.locator('#maker-fax-number').fill('090-9777-5980')
    await page.locator('#maker-email').fill('sample_maker67@example.com')
    await page.locator('#maker-home-page').fill('https://example.com/sample_maker75')
    await page.locator('#maker-manufacturer-rep').fill('阿部 蓮')

    // 登録実行
    await page.getByRole('button', { name: '登録' }).click()

    // 詳細ページへの遷移確認
    await expect(page.getByRole('heading', { name: 'メーカー情報' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: '合資会社藤原印刷' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: '262-0044' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: '東京都渋谷区神南1-2-37' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: '070-4207-7874' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: '090-9777-5980' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: 'sample_maker67@example.com' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: 'https://example.com/sample_maker75' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: '阿部 蓮' })).toBeVisible()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    // メーカー情報の編集ページへ
    await page.getByRole('link', { name: 'メーカー情報の編集' }).click()

    // 更新ページへの遷移確認
    await expect(page.getByRole('heading', { name: 'メーカー情報の編集' })).toBeVisible()
    await expect(page.locator('#maker-name')).toHaveValue('合資会社藤原印刷')
    await expect(page.locator('#maker-postal-code')).toHaveValue('262-0044')
    await expect(page.locator('#maker-address')).toHaveValue('東京都渋谷区神南1-2-37')
    await expect(page.locator('#maker-phone-number')).toHaveValue('070-4207-7874')
    await expect(page.locator('#maker-fax-number')).toHaveValue('090-9777-5980')
    await expect(page.locator('#maker-email')).toHaveValue('sample_maker67@example.com')
    await expect(page.locator('#maker-home-page')).toHaveValue('https://example.com/sample_maker75')
    await expect(page.locator('#maker-manufacturer-rep')).toHaveValue('阿部 蓮')

    // メーカー名を変更
    await page.locator('#maker-name').fill('株式会社藤原印刷')

    // 更新を実行
    await page.getByRole('button', { name: '更新' }).click()

    // 詳細ページへの遷移確認
    await expect(page.getByRole('heading', { name: 'メーカー情報' })).toBeVisible()

    await expect(page.getByRole('listitem').filter({ hasText: '株式会社藤原印刷' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: '262-0044' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: '東京都渋谷区神南1-2-37' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: '070-4207-7874' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: '090-9777-5980' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: 'sample_maker67@example.com' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: 'https://example.com/sample_maker75' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: '阿部 蓮' })).toBeVisible()

    await page.getByRole('button', { name: '通知を閉じる' }).click()

    // メーカー情報の削除実行
    page.once('dialog', async dialog => {
      await dialog.accept()
    })
    await page.locator('button', { hasText: 'メーカー情報の削除' }).click()

    // 一覧ページへの遷移確認
    await expect(page.getByRole('heading', { name: 'メーカーリスト' })).toBeVisible()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/makers?page=2')
    await expect(page.getByRole('link').filter({ hasText: '株式会社藤原印刷' })).not.toBeVisible()
  })
})
