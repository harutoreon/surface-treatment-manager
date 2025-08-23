import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect } from 'vitest'
import staticPageRoutes from '@/router/routes/static_pages'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [...staticPageRoutes]
})

router.afterEach((to) => {
  const defaultTitle = 'surface-treatment-manager'
  document.title = to.meta?.title || defaultTitle
})

describe('Static Pages routing', () => {
  describe('Home route', () => {
    it('「メインメニュー」ページに遷移すること', async () => {
      await router.push('/home')

      expect(router.currentRoute.value.meta.title).toBe('Home')
      expect(document.title).toBe('Home')
    })
  })

  describe('Treatment search route', () => {
    it('「処理名で検索」ページに遷移すること', async () => {
      await router.push('/static_pages/name')

      expect(router.currentRoute.value.meta.title).toBe('Static Pages Name')
      expect(document.title).toBe('Static Pages Name')
    })
  })

  describe('Category search route', () => {
    it('「カテゴリーで検索」ページに遷移すること', async () => {
      await router.push('/static_pages/category')

      expect(router.currentRoute.value.meta.title).toBe('Static Pages Category')
      expect(document.title).toBe('Static Pages Category')
    })
  })

  describe('maker search route', () => {
    it('「メーカー名で検索」ページに遷移すること', async () => {
      await router.push('/static_pages/maker')

      expect(router.currentRoute.value.meta.title).toBe('Static Pages Maker')
      expect(document.title).toBe('Static Pages Maker')
    })
  })
})
