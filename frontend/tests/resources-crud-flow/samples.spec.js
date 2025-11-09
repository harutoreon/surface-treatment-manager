import { test, expect } from '@playwright/test'

test.describe('samples crud flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: '管理者ユーザー' }).check()
    await page.getByRole('button', { name: 'ログイン' }).click()
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    await page.goto('/samples/new')
  })

  test('表面処理情報の新規登録・更新・削除ができること', async ({ page }) => {
    // /samples/newページの検証
    await expect(page.getByRole('heading', { name: '表面処理情報の登録' })).toBeVisible()

    // 表面処理情報の入力
    await page.locator('#sample-name').fill('テフロンコーティング')
    await page.locator('#sample-category').selectOption('コーティング')
    await page.locator('#sample-color').fill('ブラック')
    await page.locator('#sample-maker').fill('田吉ABC株式会社')
    await page.locator('#sample-hardness').fill('鉛筆硬度でFから3H')
    await page.locator('#sample-film-thickness').fill('5μmから1mm')
    await page.locator('#sample-feature').fill('耐食性・耐摩耗性・耐薬品性・耐熱性')
    await page.locator('#sample-summary').fill('フッ素樹脂が持つ特性を部材の表面に与えることで、部材の保護などを実現する表面処理。')
    await page.locator('#sample-image').setInputFiles('./tests/assets/sample.jpg')

    // 登録の実行
    await page.getByRole('button', { name: '登録' }).click()

    // /samples/idページの検証
    await expect(page.getByRole('heading', { name: '表面処理情報' })).toBeVisible()
    await expect(page.getByRole('listitem')).toHaveText(
      [
        '処理名：テフロンコーティング',
        'カテゴリー：コーティング',
        '色調：ブラック',
        'メーカー：田吉ABC株式会社',
        '硬度：鉛筆硬度でFから3H',
        '膜厚：5μmから1mm',
        '特徴：耐食性・耐摩耗性・耐薬品性・耐熱性',
        '概要：フッ素樹脂が持つ特性を部材の表面に与えることで、部材の保護などを実現する表面処理。',
        '画像：'  // ラベルのみの検証
      ]
    )
    await expect(page.locator('#sample_image')).toHaveAttribute('alt', 'Sample Image')
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    // 表面処理情報の編集ページへ
    await page.getByRole('link', { name: '表面処理情報の編集' }).click()

    // /samples/id/editページの検証
    await expect(page.getByRole('heading', { name: '表面処理情報の編集' })).toBeVisible()

    await expect(page.locator('#sample-name')).toHaveValue('テフロンコーティング')
    await expect(page.locator('#sample-category')).toHaveValue('コーティング')
    await expect(page.locator('#sample-color')).toHaveValue('ブラック')
    await expect(page.locator('#sample-maker')).toHaveValue('田吉ABC株式会社')
    await expect(page.locator('#sample-hardness')).toHaveValue('鉛筆硬度でFから3H')
    await expect(page.locator('#sample-film-thickness')).toHaveValue('5μmから1mm')
    await expect(page.locator('#sample-feature')).toHaveValue('耐食性・耐摩耗性・耐薬品性・耐熱性')
    await expect(page.locator('#sample-summary')).toHaveValue('フッ素樹脂が持つ特性を部材の表面に与えることで、部材の保護などを実現する表面処理。')
    await expect(page.locator('#sample-image')).toHaveAttribute('alt', 'No Image')

    // 色調を変更
    await page.locator('#sample-color').fill('パープル')

    // 更新の実行
    await page.getByRole('button', { name: '更新' }).click()

    // /samples/idページの検証
    await expect(page.getByRole('heading', { name: '表面処理情報' })).toBeVisible()
    await expect(page.getByRole('listitem')).toHaveText(
      [
        '処理名：テフロンコーティング',
        'カテゴリー：コーティング',
        '色調：パープル',
        'メーカー：田吉ABC株式会社',
        '硬度：鉛筆硬度でFから3H',
        '膜厚：5μmから1mm',
        '特徴：耐食性・耐摩耗性・耐薬品性・耐熱性',
        '概要：フッ素樹脂が持つ特性を部材の表面に与えることで、部材の保護などを実現する表面処理。',
        '画像：'  // ラベルのみの検証
      ]
    )
    await page.getByRole('button', { name: '通知を閉じる' }).click()

    // 表面処理情報の削除を実行
    page.once('dialog', async dialog => {
      await dialog.accept()
    })
    await page.locator('p', { hasText: '表面処理情報の削除' }).click()

    // /samplesページの検証
    await expect(page.getByRole('heading', { name: '表面処理リスト' })).toBeVisible()
    await page.locator('a[href="/samples?page=5"]').click()
    await expect(page.getByText('テフロンコーティング')).not.toBeVisible()
    await page.getByRole('button', { name: '通知を閉じる' }).click()
  })

  test.describe('ファイル容量が5MB未満の場合', () => {
    test('容量エラーのメッセージが表示されないこと', async ({ page }) => {
      await page.locator('#sample-image').setInputFiles('./tests/assets/valid_image.jpg')
      await expect(page.getByText('5MB未満のファイルに変更して下さい。')).not.toBeVisible()
    })
  })

  test.describe('ファイル容量が5MBを超える場合', () => {
    test('容量エラーのメッセージが表示されること', async ({ page }) => {
      await page.locator('#sample-image').setInputFiles('./tests/assets/invalid_image.jpg')
      await expect(page.getByText('5MB未満のファイルに変更して下さい。')).toBeVisible()
    })
  })
})
