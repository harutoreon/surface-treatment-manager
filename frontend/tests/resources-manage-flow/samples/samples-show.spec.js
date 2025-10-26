import { test, expect } from '@playwright/test'

test.describe('samples/id flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.locator('#manage-samples').getByRole('link', { name: '管理ページへ' }).click()
  })

  test.describe('無電解ニッケルめっきのリンクをクリックした場合', () => {
    test('表面処理情報ページが表示されること', async ({ page }) => {
      await page.getByRole('link', { name: '無電解ニッケルめっき' }).click()

      await expect(page).toHaveURL('/samples/1')
      await expect(page.getByRole('heading', { name: '表面処理情報' })).toBeVisible()

      await expect(page.getByText('無電解ニッケルめっき')).toBeVisible()
      await expect(page.getByText('めっき', { exact: true })).toBeVisible()
      await expect(page.getByText('イエローブラウンシルバー')).toBeVisible()
      await expect(page.getByText('河野電気株式会社')).toBeVisible()
      await expect(page.getByText('析出状態の皮膜硬度でHV550～HV700')).toBeVisible()
      await expect(page.getByText('通常は3～5μm、厚めの場合は20～50μmまで可能')).toBeVisible()
      await expect(page.getByText('耐食性・耐摩耗性・耐薬品性・耐熱性')).toBeVisible()
      await expect(page.getByText('電気を使わず化学反応で金属表面にニッケルを析出する技術です。')).toBeVisible()
      await expect(page.getByRole('img', { name: 'Sample Image' })).toBeVisible()

      await page.getByRole('heading', { name: 'コメントリスト' }).click()
      
      await expect(page.getByRole('link', { name: '表面処理情報の編集' })).toBeVisible()
      await expect(page.getByText('表面処理情報の削除')).toBeVisible()
      await expect(page.getByRole('link', { name: '表面処理リストへ' })).toBeVisible()
    })
  })
})
