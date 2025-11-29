import { test, expect } from '@playwright/test'

test.describe('categories show flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/categories/1')
  })

  test.describe('初期レンダリングに成功した場合', () => {
    test('カテゴリー情報が表示されること', async ({ page }) => {
      await expect(page).toHaveURL('/categories/1')
      await expect(page.getByRole('heading', { name: 'カテゴリー情報' })).toBeVisible()

      await expect(page.getByRole('listitem').filter({ hasText: 'めっき' })).toBeVisible()
      await expect(page.getByRole('listitem').filter({ hasText: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。' })).toBeVisible()
    })
  })

  test.describe('カテゴリー情報の編集リンクをクリックした場合', () => {
    test('/categories/1/editに移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'カテゴリー情報の編集' }).click()

      await expect(page).toHaveURL('/categories/1/edit')
      await expect(page.getByRole('heading', { name: 'カテゴリー情報の編集' })).toBeVisible()
    })
  })

  test.describe('カテゴリーリストへのリンクをクリックした場合', () => {
    test('/categoriesに移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'カテゴリーリストへ' }).click()

      await expect(page).toHaveURL('/categories')
      await expect(page.getByRole('heading', { name: 'カテゴリーリスト' })).toBeVisible()
    })
  })
})
