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

      await expect(page.getByRole('listitem').filter({ hasText: /.{1,4}部$/ })).toBeVisible()
      await expect(page.getByRole('listitem').filter({ hasText: /\p{Script=Han}{1,3} \p{Script=Han}{1,3}/u})).toBeVisible()
      await expect(page.getByRole('listitem').filter({ hasText: /.+。/ })).toBeVisible()

      await expect(page.getByRole('link', { name: 'コメント情報の編集' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'コメントリストへ' })).toBeVisible()
      await expect(page.getByRole('link', { name: '表面処理情報へ' })).toBeVisible()
    })
  })

  test.describe('コメント情報の編集リンクをクリックした時', () => {
    test('/comments/1/editに移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'コメント情報の編集' }).click()

      await expect(page).toHaveURL('/comments/1/edit')
      await expect(page.getByRole('heading', { name: 'コメント情報の編集' })).toBeVisible()
    })
  })

  test.describe('コメントリストへのリンクをクリックした時', () => {
    test('/commentsに移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'コメントリストへ' }).click()

      await expect(page).toHaveURL('/comments')
      await expect(page.getByRole('heading', { name: 'コメントリスト' })).toBeVisible()
    })
  })

  test.describe('表面処理情報へのリンクをクリックした時', () => {
    test('表面処理情報ページに移動すること', async ({ page }) => {
      await page.getByRole('link', { name: '表面処理情報へ' }).click()

      await expect(page).toHaveURL(/\/samples\/.+/)
      await expect(page.getByRole('heading', { name: '表面処理情報' })).toBeVisible()
    })
  })
})
