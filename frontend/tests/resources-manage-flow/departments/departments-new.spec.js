import { test, expect } from '@playwright/test'

test.describe('departments new flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/departments/new')
  })

  test.describe('初期レンダリングに成功した場合', () => {
    test('部署情報の登録ページが表示されること', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '部署情報の登録' })).toBeVisible()

      await expect(page.locator('#department-name')).toBeVisible()

      await expect(page.getByRole('button', { name: '登録' })).toBeVisible()

      await expect(page.getByRole('link', { name: '部署リスト' })).toBeVisible()
    })
  })

  test.describe('部署リストのリンクをクリックした場合', () => {
    test('/departmentsへ移動すること', async ({ page }) => {
      await page.getByRole('link', { name: '部署リストへ' }).click()

      await expect(page).toHaveURL('/departments')
      await expect(page.getByRole('heading', { name: '部署リスト' })).toBeVisible()
    })
  })
})
