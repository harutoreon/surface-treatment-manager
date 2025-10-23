import { test, expect } from '@playwright/test'

test.describe('ログアウトフロー', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('radio', { name: '一般ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()

    await page.getByRole('button', { name: '通知を閉じる' }).click()
  })

  test.describe('ログアウトのアラートでOKを押した場合', () => {
    test('ログインページに移動すること', async ({ page }) => {
      await page.getByRole('link', { name: '管理ページへ' }).click()

      await expect(page).toHaveURL('http://localhost:5173/settings')
      await expect(page.getByRole('heading', { name: 'アプリケーションの管理' })).toBeVisible()

      page.once('dialog', async dialog => {
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'ログアウト' }).click()

      await expect(page).toHaveURL('http://localhost:5173')
      await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()
    })
  })

  test.describe('ログアウトのアラートでキャンセルを押した場合', () => {
    test('アプリケーションの管理ページに留まること', async ({ page }) => {
      await page.getByRole('link', { name: '管理ページへ' }).click()

      await expect(page).toHaveURL('http://localhost:5173/settings')
      await expect(page.getByRole('heading', { name: 'アプリケーションの管理' })).toBeVisible()

      page.once('dialog', async dialog => {
        await dialog.dismiss()
      })

      await page.getByRole('button', { name: 'ログアウト' }).click()

      await expect(page).toHaveURL('http://localhost:5173/settings')
      await expect(page.getByRole('heading', { name: 'アプリケーションの管理' })).toBeVisible()
    })
  })
})
