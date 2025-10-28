import { test, expect } from '@playwright/test'

test.describe('samples/id/edit flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()
  })

  test.describe('初期レンダリングに成功した場合', () => {
    test('表面処理情報の編集ページが表示されること', async ({ page }) => {
      await page.goto('/samples/32/edit')

      await expect(page.getByRole('heading', { name: '表面処理情報の編集' })).toBeVisible()
      await expect(page.locator('#sample-name')).toHaveValue('カナック')
      await expect(page.locator('#sample-category')).toHaveValue('表面硬化')
      await expect(page.locator('#sample-color')).toHaveValue('ブラウン')
      await expect(page.locator('#sample-maker')).toBeVisible()
      await expect(page.locator('#sample-hardness')).toHaveValue('Hv800～1400程度')
      await expect(page.locator('#sample-film-thickness')).toHaveValue('寸法変化は0～5µm程度')
      await expect(page.locator('#sample-feature')).toHaveValue('耐食性・耐熱性・摺動性')
      await expect(page.locator('#sample-summary')).toHaveValue('金属表面に耐摩耗性と防錆性を付与するコーティング技術です。')
      await expect(page.locator('#sample-image')).toBeVisible()

      await expect(page.getByRole('link', { name: '表面処理情報へ' })).toBeVisible()
      await expect(page.getByRole('link', { name: '表面処理リストへ' })).toBeVisible()
    })
  })

  test.describe('表面処理リストへのリンクをクリックした場合', () => {
    test('/samplesへ移動すること', async ({ page }) => {
      await page.goto('/samples/1/edit')

      await page.getByRole('link', { name: '表面処理リストへ' }).click()

      await expect(page).toHaveURL('/samples')
      await expect(page.getByRole('heading', { name: '表面処理リスト' })).toBeVisible()
    })
  })
})
