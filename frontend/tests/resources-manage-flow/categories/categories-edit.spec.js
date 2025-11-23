import { test, expect } from '@playwright/test'

test.describe('categories edit flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/categories/1/edit')
  })

  test.describe('初期レンダリングに成功した場合', () => {
    test('カテゴリー情報の編集ページが表示されること', async ({ page }) => {
      await expect(page).toHaveURL('/categories/1/edit')
      await expect(page.getByRole('heading', { name: 'カテゴリー情報の編集' })).toBeVisible()

      await expect(page.locator('#category-item')).toHaveValue('めっき')
      await expect(page.locator('#category-summary')).toHaveValue(
        '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
      )

      await expect(page.getByRole('button', { name: '更新' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'キャンセル' })).toBeVisible()
    })
  })

  test.describe('キャンセルボタンを押した場合', () => {
    test('表面処理ページに移動すること', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'キャンセル' })).toBeVisible()

      await page.getByRole('button', { name: 'キャンセル' }).click()

      await expect(page).toHaveURL('/categories/1/edit')
      await expect(page.getByRole('heading', { name: 'カテゴリー情報' })).toBeVisible()
    })
  })
})