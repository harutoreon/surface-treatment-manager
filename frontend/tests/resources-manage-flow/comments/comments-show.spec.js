import { test, expect } from '@playwright/test'

test.describe('comments show flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/comments/1')
  })

  test.describe('初期レンダリングに成功した時', () => {
    test('コメント情報ページが表示されること', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'コメント情報' })).toBeVisible()

      await expect(page.getByRole('listitem')).toHaveText(
        [
          /部署名 :/,
          /投稿者 :/,
          /コメント :/,
        ]
      )

      await expect(page.getByRole('link', { name: 'コメント情報の編集' })).toBeVisible()
      await expect(page.locator('p', { hasText: 'コメント情報の削除' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'コメントリストへ' })).toBeVisible()
    })
  })

  test.describe('コメントリストへのリンクをクリックした時', () => {
    test('/commentsに移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'コメントリストへ' }).click()

      await expect(page).toHaveURL('/comments')
      await expect(page.getByRole('heading', { name: 'コメントリスト' })).toBeVisible()
    })
  })
})
