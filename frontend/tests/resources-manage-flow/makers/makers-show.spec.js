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

      await expect(page.getByRole('listitem').filter({ hasText: /メーカー名:.*会社/ })).toBeVisible()
      await expect(page.getByRole('listitem').filter({ hasText: /郵便番号:\d{3}-\d{4}/ })).toBeVisible()
      await expect(page.getByRole('listitem').filter({ hasText: /住所:山口県西悠斗町1-2-\d{1,2}/ })).toBeVisible()
      await expect(page.getByRole('listitem').filter({ hasText: /電話番号:\d{3}-\d{4}-\d{4}/ })).toBeVisible()
      await expect(page.getByRole('listitem').filter({ hasText: /FAX番号:\d{3}-\d{4}-\d{4}/ })).toBeVisible()
      await expect(page.getByRole('listitem').filter({ hasText: /Email:sample_maker\d{1,2}@example.com/ })).toBeVisible()
      await expect(page.getByRole('listitem').filter({ hasText: /ホームページ:https:\/\/touadenka.example.com\// })).toBeVisible()
      await expect(page.getByRole('listitem').filter({ hasText: /担当者:\p{Script=Han}{1,3} \p{Script=Han}{1,3}/u })).toBeVisible()

      await expect(page.getByRole('link', { name: 'メーカー情報の編集へ' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'メーカーリストへ' })).toBeVisible()

      await expect(page.getByRole('button', { name: 'メーカー情報の削除' })).toBeVisible()
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
