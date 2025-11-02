import { test, expect } from '@playwright/test'

test.describe('makers edit flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/makers/1/edit')
  })

  test.describe('初期レンダリングに成功した場合', () => {
    test('メーカー情報の編集ページが表示されること', async ({ page }) => {
      await expect(page).toHaveURL('/makers/1/edit')
      await expect(page.getByRole('heading', { name: 'メーカー情報の編集' })).toBeVisible()

      await expect(page.locator('#maker-name')).toBeVisible()
      await expect(page.locator('#maker-postal-code')).toBeVisible()
      await expect(page.locator('#maker-address')).toBeVisible()
      await expect(page.locator('#maker-phone-number')).toBeVisible()
      await expect(page.locator('#maker-fax-number')).toBeVisible()
      await expect(page.locator('#maker-email')).toBeVisible()
      await expect(page.locator('#maker-home-page')).toBeVisible()
      await expect(page.locator('#maker-manufacturer-rep')).toBeVisible()

      await expect(page.getByRole('button', { name: '更新' })).toBeVisible()

      await expect(page.getByRole('link', { name: 'メーカー情報へ' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'メーカーリストへ' })).toBeVisible()
    })
  })

  test.describe('メーカー情報へのリンクをクリックした時', () => {
    test('/makers/1に移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'メーカー情報へ' }).click()

      await expect(page).toHaveURL('/makers/1')
      await expect(page.getByRole('heading', { name: 'メーカー情報' })).toBeVisible()
    })
  })

  test.describe('メーカーリストへのリンクをクリックした時', () => {
    test('/categoriesに移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'メーカーリストへ' }).click()

      await expect(page).toHaveURL('/makers')
      await expect(page.getByRole('heading', { name: 'メーカーリスト' })).toBeVisible()
    })
  })
})