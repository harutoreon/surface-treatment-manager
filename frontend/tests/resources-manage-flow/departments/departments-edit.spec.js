import { test, expect } from '@playwright/test'

test.describe('departments edit flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/departments/1/edit')
  })

  test.describe('初期レンダリングに成功した場合', () => {
    test('部署情報の編集ページが表示されること', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '部署情報の編集' })).toBeVisible()

      await expect(page.locator('#department-name')).toBeVisible()

      await expect(page.getByRole('button', { name: '更新' })).toBeVisible()

      await expect(page.getByRole('link', { name: '部署情報へ' })).toBeVisible()
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
