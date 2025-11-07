import { test, expect } from '@playwright/test'

test.describe('categories crud flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/categories/new')
  })

  test('カテゴリーの新規登録・更新・削除ができること', async ({ page }) => {
    // /categories/newページの検証
    await expect(page.getByRole('heading', { name: 'カテゴリー情報の登録' })).toBeVisible()

    // カテゴリーと概要文の入力
    await page.locator('#category-item').fill('溶射')
    await page.locator('#category-summary').fill('溶融・軟化させた溶射材を表面に吹き付ける処理。')

    // 登録実行
    await page.getByRole('button', { name: '登録' }).click()

    // /categories/idページの検証
    await expect(page.getByRole('heading', { name: 'カテゴリー情報' })).toBeVisible()
    await expect(page.getByRole('listitem')).toHaveText(
      [
        'カテゴリー名 :溶射',
        '概要 :溶融・軟化させた溶射材を表面に吹き付ける処理。'
      ]
    )
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    // カテゴリー情報の編集ページへ
    await page.getByRole('link', { name: 'カテゴリー情報の編集' }).click()

    // /categories/id/editページの検証
    await expect(page.getByRole('heading', { name: 'カテゴリー情報の編集' })).toBeVisible()
    await expect(page.locator('#category-item')).toHaveValue('溶射')
    await expect(page.locator('#category-summary')).toHaveValue(
      '溶融・軟化させた溶射材を表面に吹き付ける処理。'
    )

    // 概要文を変更
    await page.locator('#category-summary').fill('溶融・軟化させた溶射材を表面に吹き付ける処理のこと。')

    // 更新を実行
    await page.getByRole('button', { name: '更新' }).click()

    // /categories/idページの検証
    await expect(page.getByRole('heading', { name: 'カテゴリー情報' })).toBeVisible()
    await expect(page.getByRole('listitem')).toHaveText(
      [
        'カテゴリー名 :溶射',
        '概要 :溶融・軟化させた溶射材を表面に吹き付ける処理のこと。'
      ]
    )
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    // カテゴリーの削除実行
    page.once('dialog', async dialog => {
      await dialog.accept()
    })
    await page.locator('p', { hasText: 'カテゴリー情報の削除' }).click()

    // /categoriesページの検証
    await expect(page.getByRole('heading', { name: 'カテゴリーリスト' })).toBeVisible()
    await expect(page.getByText('溶射', { exact: true })).not.toBeVisible()
    await page.getByRole('button', { name: '通知を閉じる' }).click()
  })
})
