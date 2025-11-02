import { test, expect } from '@playwright/test'

test.describe('users show flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/departments/1')
  })

  test.describe('初期レンダリングに成功した時', () => {
    test('部署情報ページが表示されること', async ({ page }) => {
      await expect(page).toHaveURL('/departments/1')
      await expect(page.getByRole('heading', { name: '部署情報' })).toBeVisible()

      await expect(page.getByRole('listitem')).toHaveText(
        [
          /部署名 :/,
        ]
      )

      await expect(page.getByRole('link', { name: '部署情報の編集' })).toBeVisible()
      await expect(page.locator('p', { hasText: '部署情報の削除' })).toBeVisible()
      await expect(page.getByRole('link', { name: '部署リストへ' })).toBeVisible()
    })
  })

  test.describe('部署リストへのリンクをクリックした時', () => {
    test('/departmentsに移動すること', async ({ page }) => {
      await page.getByRole('link', { name: '部署リストへ' }).click()

      await expect(page).toHaveURL('/departments')
      await expect(page.getByRole('heading', { name: '部署リスト' })).toBeVisible()
    })
  })
})
