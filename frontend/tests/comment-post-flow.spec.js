import { test, expect } from '@playwright/test'

test.describe('comment post flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/samples/1')
  })

  test('コメントの新規作成ボタンを押すとモーダルが表示されること', async ({ page }) => {
    // samples/idページの表示検証
    await expect(page.getByRole('heading', { name: '表面処理情報' })).toBeVisible()

    await page.getByRole('button', { name: 'コメントの新規作成' }).click()

    // モーダルのレイアウト検証
    await expect(page.locator('.modal-header')).toBeVisible()
    await expect(page.getByRole('textbox', { name: '氏名' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: '部署名' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'コメント' })).toBeVisible()
    await expect(page.getByRole('button', { name: '閉じる' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'リストに追加' })).toBeVisible()
  })

  test.describe('コメントの新規作成に成功した場合', () => {
    test('コメントリストに反映されること', async ({ page }) => {
      // samples/idページの表示検証
      await expect(page.getByRole('heading', { name: '表面処理情報' })).toBeVisible()

      await page.getByRole('button', { name: 'コメントの新規作成' }).click()

      await page.getByRole('textbox', { name: '氏名' }).fill('佐藤 太郎')
      await page.getByRole('textbox', { name: '部署名' }).fill('営業部')
      await page.getByRole('textbox', { name: 'コメント' }).fill('このめっきの膜厚は均一です。')

      await page.getByRole('button', { name: 'リストに追加' }).click()

      // モーダルの非表示検証
      await expect(page.locator('.modal-header')).not.toBeVisible()

      // コメントリストへの反映検証
      await expect(page.getByRole('heading', { name: '営業部：佐藤 太郎' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'このめっきの膜厚は均一です。' })).toBeVisible()

      // コメントの削除処理
      // await page.goto('/comments?page=16')
      await page.getByRole('link').filter({ hasText: '佐藤 太郎' }).click()
      // await page.getByRole('link', { name: '営業部：佐藤 太郎' }).click()

      page.once('dialog', async dialog => {
        await dialog.accept()
      })
      await page.locator('button', { hasText: 'コメント情報の削除' }).click()

      // コメントの削除検証
      await page.goto('/samples/1')
      await expect(page.getByRole('heading', { name: '営業部：佐藤 太郎' })).not.toBeVisible()
      await expect(page.getByRole('heading', { name: 'このめっきの膜厚は均一です。' })).not.toBeVisible()
    })
  })

  test.describe('コメントの新規作成に失敗した場合', () => {
    test('入力不備のコメントが表示されること', async ({ page }) => {
      // samples/idページの表示検証
      await expect(page.getByRole('heading', { name: '表面処理情報' })).toBeVisible()

      await page.getByRole('button', { name: 'コメントの新規作成' }).click()

      // すべての項目を未入力状態で
      await page.getByRole('button', { name: 'リストに追加' }).click()

      // 入力不備コメントの表示検証
      await expect(page.getByText('入力に不備があります。')).toBeVisible()
      await page.getByRole('button', { name: '閉じる' }).click()
    })
  })
})
