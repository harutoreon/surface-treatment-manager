import { test, expect } from '@playwright/test'

test.describe('users crud flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/users/new')
  })

  test('ユーザーの新規登録・更新・削除ができること', async ({ page }) => {
    // /users/newページの検証
    await expect(page.getByRole('heading', { name: 'ユーザー情報の登録' })).toBeVisible()

    // ユーザー情報の入力
    await page.locator('#user-name').fill('森 はじめ')
    await page.locator('#user-department').selectOption('製造部')
    await page.locator('#user-password').fill('foobar')
    await page.locator('#user-password-confirmation').fill('foobar')

    // 登録実行
    await page.getByRole('button', { name: '登録' }).click()

    // /users/idページの検証
    await expect(page.getByRole('heading', { name: 'ユーザー情報' })).toBeVisible()
    await expect(page.getByRole('listitem')).toHaveText(
      [
        'ユーザー名：森 はじめ',
        '部署名：製造部',
      ]
    )
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    // ユーザー情報の編集ページへ
    await page.getByRole('link', { name: 'ユーザー情報の編集' }).click()

    // /users/id/editページの検証
    await expect(page.getByRole('heading', { name: 'ユーザー情報の編集' })).toBeVisible()
    await expect(page.locator('#user-name')).toHaveValue('森 はじめ')
    await expect(page.locator('#user-department')).toHaveValue('製造部')

    // 部署名を変更
    await page.locator('#user-department').fill('営業部')

    // 更新を実行
    await page.getByRole('button', { name: '更新' }).click()

    // /users/idページの検証
    await expect(page.getByRole('heading', { name: 'ユーザー情報' })).toBeVisible()
    await expect(page.getByRole('listitem')).toHaveText(
      [
        'ユーザー名：森 はじめ',
        '部署名：営業部',
      ]
    )
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    // ユーザー情報の削除実行
    page.once('dialog', async dialog => {
      await dialog.accept()
    })
    await page.locator('p', { hasText: 'ユーザーの削除' }).click()

    // /usersページの検証
    await expect(page.getByRole('heading', { name: 'ユーザーリスト' })).toBeVisible()
    await page.getByRole('button', { name: '通知を閉じる' }).click()
  })
})
