import { test, expect } from '@playwright/test'

test.describe('comments crud flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/comments/new')
  })

  test('コメントの新規登録・更新・削除ができること', async ({ page }) => {
    // /comments/newページの検証
    await expect(page.getByRole('heading', { name: 'コメント情報の新規登録' })).toBeVisible()

    // コメント情報の入力
    await page.locator('#commenter').fill('宮崎 彩')
    await page.locator('#departments').selectOption('製造部')
    await page.locator('#samples').selectOption('無電解ニッケルめっき')
    await page.locator('#body').fill('表面処理により耐熱性が向上し、高温環境でも問題ありません。')

    // 登録の実行
    await page.getByRole('button', { name: '登録' }).click()

    // /comments/idページの検証
    await expect(page.getByRole('heading', { name: 'コメント情報' })).toBeVisible()
    await expect(page.getByRole('listitem')).toHaveText(
      [
        /部署名 :製造部/,
        /投稿者 :宮崎 彩/,
        /コメント :表面処理により耐熱性が向上し、高温環境でも問題ありません。/,
      ]
    )
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    // コメント情報の編集ページへ
    await page.getByRole('link', { name: 'コメント情報の編集' }).click()

    // /comments/id/editページの検証
    await expect(page.getByRole('heading', { name: 'コメント情報の編集' })).toBeVisible()
    await expect(page.locator('#department')).toHaveValue('製造部')
    await expect(page.locator('#commenter')).toHaveValue('宮崎 彩')
    await expect(page.locator('#body')).toHaveValue('表面処理により耐熱性が向上し、高温環境でも問題ありません。')

    // コメントを変更
    await page.locator('#body').fill('表面が非常に硬く、傷がつきにくいです。')

    // 更新の実行
    await page.getByRole('button', { name: '更新' }).click()

    // /comments/idページの検証
    await expect(page.getByRole('heading', { name: 'コメント情報' })).toBeVisible()
    await expect(page.getByRole('listitem')).toHaveText(
      [
        /部署名 :製造部/,
        /投稿者 :宮崎 彩/,
        /コメント :表面が非常に硬く、傷がつきにくいです。/,
      ]
    )
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    // コメント情報の削除を実行
    page.once('dialog', async dialog => {
      await dialog.accept()
    })
    await page.locator('p', { hasText: 'コメント情報の削除' }).click()

    // /commentsページの検証
    await expect(page.getByRole('heading', { name: 'コメントリスト' })).toBeVisible()
    await page.goto('/comments?page=16')
    await expect(page.locator('a[href="/comments?page=16"]')).toBeVisible()
    await expect(page.locator('a[href="/comments?page=17"]')).not.toBeVisible()
  })
})
