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
    const commenter = '岩崎 颯太'
    const department = '品質管理部'
    const newComment = '表面処理により耐熱性が向上し、高温環境でも問題ありません。'
    const editedComment = '表面が非常に硬く、傷がつきにくいです。'

    // /comments/newページの検証
    await expect(page.getByRole('heading', { name: 'コメント情報の新規登録' })).toBeVisible()

    // コメント情報の入力
    await page.locator('#commenter').fill('岩崎')
    await page.getByText(commenter).click()
    await page.locator('#makers').selectOption('東亜電化工業株式会社')
    await page.locator('#samples').selectOption('無電解ニッケルめっき')
    await page.locator('#body').fill(newComment)

    // 登録の実行
    await page.getByRole('button', { name: '登録' }).click()

    // /comments/idページの検証
    await expect(page.getByRole('heading', { name: 'コメント情報' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: commenter })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: department })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: newComment })).toBeVisible()

    // コメント情報の編集ページへ
    await page.getByRole('link', { name: 'コメント情報の編集' }).click()

    // /comments/id/editページの検証
    await expect(page.getByRole('heading', { name: 'コメント情報の編集' })).toBeVisible()
    await expect(page.locator('#commenter')).toHaveValue(commenter)
    await expect(page.locator('#department')).toHaveValue(department)
    await expect(page.locator('#body')).toHaveValue(newComment)

    // コメントを変更
    await page.locator('#body').fill(editedComment)

    // 更新の実行
    await page.getByRole('button', { name: '更新' }).click()

    // /comments/idページの検証
    await expect(page.getByRole('heading', { name: 'コメント情報' })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: commenter })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: department })).toBeVisible()
    await expect(page.getByRole('listitem').filter({ hasText: editedComment })).toBeVisible()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    // コメント情報の削除を実行
    page.once('dialog', async dialog => {
      await dialog.accept()
    })
    await page.locator('button', { hasText: 'コメント情報の削除' }).click()

    // /commentsページの検証
    await page.goto('/comments?page=23')
    await expect(page.getByRole('heading', { name: 'コメントリスト' })).toBeVisible()
    await expect(page.getByRole('link').filter({ hasText: commenter })).not.toBeVisible()
  })
})
