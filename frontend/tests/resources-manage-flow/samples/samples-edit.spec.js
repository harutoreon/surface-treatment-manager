import { test, expect } from '@playwright/test'

test.describe('samples/id/edit flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/samples/32/edit')
  })

  test.describe('初期レンダリングに成功した場合', () => {
    test('表面処理情報の編集ページが表示されること', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '表面処理情報の編集' })).toBeVisible()
      await expect(page.locator('#sample-name')).toHaveValue('カナック')
      await expect(page.locator('#sample-category')).toHaveValue('表面硬化')
      await expect(page.locator('#sample-color')).toHaveValue('ブラウン')
      await expect(page.locator('#sample-hardness')).toHaveValue('Hv800～1400程度')
      await expect(page.locator('#sample-film-thickness')).toHaveValue('寸法変化は0～5µm程度')
      await expect(page.locator('#sample-feature')).toHaveValue('耐食性・耐熱性・摺動性')
      await expect(page.locator('#sample-summary')).toHaveValue('金属表面に耐摩耗性と防錆性を付与するコーティング技術です。')
      await expect(page.locator('#sample-image')).toBeVisible()

      await expect(page.getByRole('button', { name: '更新' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'キャンセル' })).toBeVisible()
    })
  })

  test.describe('キャンセルボタンを押した場合', () => {
    test('表面処理情報ページに移動すること', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'キャンセル' })).toBeVisible()

      await page.getByRole('button', { name: 'キャンセル' }).click()

      await expect(page).toHaveURL('/samples/32')
      await expect(page.getByRole('heading', { name: '表面処理情報' })).toBeVisible()
    })
  })
})
