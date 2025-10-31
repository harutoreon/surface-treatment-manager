import { test, expect } from '@playwright/test'

test.describe('makers show flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/makers/1')
  })

  test.describe('初期レンダリングに成功した時', () => {
    test('メーカー情報ページが表示されること', async ({ page }) => {
      await expect(page).toHaveURL('/makers/1')
      await expect(page.getByRole('heading', { name: 'メーカー情報' })).toBeVisible()

      await expect(page.getByRole('listitem')).toHaveText(
        [
          /メーカー名:/,
          /郵便番号:/,
          /住所:/,
          /電話番号:/,
          /FAX番号:/,
          /Email:/,
          /ホームページ:/,
          /担当者:/,
        ]
      )

      await expect(page.getByRole('link', { name: 'メーカー情報の編集へ' })).toBeVisible()
      await expect(page.locator('#maker_destroy')).toBeVisible()
      await expect(page.getByRole('link', { name: 'メーカーリストへ' })).toBeVisible()
    })
  })

  test.describe('メーカーリストへのリンクをクリックした時', () => {
    test('/makersに移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'メーカーリストへ' }).click()

      await expect(page).toHaveURL('/makers')
      await expect(page.getByRole('heading', { name: 'メーカーリスト' })).toBeVisible()
    })
  })

  test.describe('メーカー情報の編集へのリンクをクリックした時', () => {
    test('/makers/1/editに移動すること', async ({ page }) => {
      await page.getByRole('link', { name: 'メーカー情報の編集へ' }).click()

      await expect(page).toHaveURL('/makers/1/edit')
      await expect(page.getByRole('heading', { name: 'メーカー情報の編集' })).toBeVisible()
    })
  })
})
