import { test, expect } from '@playwright/test'

test.describe('departments crud flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/departments/new')
  })

  test('部署名の新規登録・更新・削除ができること', async ({ page }) => {
    // /departments/newページの検証
    await expect(page.getByRole('heading', { name: '部署情報の登録' })).toBeVisible()

    // 部署名の入力
    await page.locator('#department-name').fill('開発二部')

    // 登録実行
    await page.getByRole('button', { name: '登録' }).click()

    // /departments/idページの検証
    await expect(page.getByRole('heading', { name: '部署情報' })).toBeVisible()

    await expect(page.getByRole('listitem').filter({ hasText: '開発二部' })).toBeVisible()

    await page.getByRole('button', { name: '通知を閉じる' }).click()

    // 部署情報の編集ページへ
    await page.getByRole('link', { name: '部署情報の編集へ' }).click()

    // /departments/id/editページの検証
    await expect(page.getByRole('heading', { name: '部署情報の編集' })).toBeVisible()
    await expect(page.locator('#department-name')).toHaveValue('開発二部')

    // 部署名を変更
    await page.locator('#department-name').fill('生産管理部')

    // 更新を実行
    await page.getByRole('button', { name: '更新' }).click()

    // /departments/idページの検証
    await expect(page.getByRole('heading', { name: '部署情報' })).toBeVisible()

    await expect(page.getByRole('listitem').filter({ hasText: '生産管理部' })).toBeVisible()

    await page.getByRole('button', { name: '通知を閉じる' }).click()

    // 部署情報の削除実行
    page.once('dialog', async dialog => {
      await dialog.accept()
    })
    await page.locator('button', { hasText: '部署情報の削除' }).click()

    // /departmentsページの検証
    await expect(page.getByRole('heading', { name: '部署リスト' })).toBeVisible()
    await expect(page.getByText('製造部', { exact: true })).toBeVisible()
    await expect(page.getByText('生産管理部', { exact: true })).not.toBeVisible()
    await page.getByRole('button', { name: '通知を閉じる' }).click()
  })
})
