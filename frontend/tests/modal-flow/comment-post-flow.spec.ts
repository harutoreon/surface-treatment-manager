import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

const fillLoginForm = async (page: Page, username: string, password: string): Promise<void> => {
  await page.getByRole('textbox', { name: 'ユーザー名' }).fill(username)
  await page.getByRole('textbox', { name: 'パスワード' }).fill(password)
  await page.getByRole('button', { name: 'ログイン' }).click()
}

test.describe('comment post flow', () => {
  let createdCommentId: string

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await fillLoginForm(page, 'admin user', 'adminpassword')
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/samples/1')
  })

  test.afterEach(async ({ request }) => {
    await request.delete(`http://localhost:3000/makers/1/samples/1/comments/${createdCommentId}`)
  })

  test.describe('コメントの新規作成に成功した場合', () => {
    test('コメントリストに反映されること', async ({ page }) => {
      // samples の詳細ページへの遷移確認
      await expect(page.getByRole('heading', { name: '表面処理情報' })).toBeVisible()

      await page.getByRole('button', { name: 'コメントの新規作成' }).click()

      await page.getByRole('textbox', { name: '氏名' }).fill('佐藤 太郎')
      await page.getByRole('textbox', { name: '部署名' }).fill('営業部')
      await page.getByRole('textbox', { name: 'コメント' }).fill('このめっきの膜厚は均一です。')

      await page.getByRole('button', { name: 'リストに追加' }).click()

      // モーダルの非表示検証
      await expect(page.locator('.modal-header')).not.toBeVisible()

      // コメントリストへの反映確認
      await expect(page.locator('#comment-department-commenter', { hasText: '営業部：佐藤 太郎' })).toBeVisible()
      await expect(page.locator('#comment-body', { hasText: 'このめっきの膜厚は均一です。' })).toBeVisible()

      // afterEach で使うコメント id の取得
      const link = page.getByRole('link').filter({ hasText: '佐藤 太郎' })
      const href = await link.getAttribute('href')
      createdCommentId = href.split('/').at(-1)
    })
  })

  test.describe('コメントの新規作成に失敗した場合', () => {
    test('入力不備のコメントが表示されること', async ({ page }) => {
      // 詳細ページへの遷移確認
      await expect(page.getByRole('heading', { name: '表面処理情報' })).toBeVisible()

      // モーダルのすべての項目を未入力状態で登録処理
      await page.getByRole('button', { name: 'コメントの新規作成' }).click()
      await page.getByRole('button', { name: 'リストに追加' }).click()

      // 入力不備コメントの表示検証
      await expect(page.getByText('入力に不備があります。')).toBeVisible()
      await page.getByRole('button', { name: '閉じる' }).click()
    })
  })
})
