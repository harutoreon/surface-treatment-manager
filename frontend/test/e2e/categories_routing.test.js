import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect } from 'vitest'
import categoryRoutes from '@/router/routes/categories'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [...categoryRoutes]
})

router.afterEach((to) => {
  const defaultTitle = 'surface-treatment-manager'
  document.title = to.meta?.title || defaultTitle
})

describe('Categories routing', () => {
  describe('Index route', () => {
    it('「カテゴリーリスト」ページに遷移できること', async () => {
      await router.push('/categories')

      expect(router.currentRoute.value.meta.title).toBe('Category Index')
      expect(document.title).toBe('Category Index')
    })
  })

  describe('Show route', () => {
    it('「カテゴリー情報」ページに遷移できること', async () => {
      await router.push('/categories/1')

      expect(router.currentRoute.value.meta.title).toBe('Category Show')
      expect(document.title).toBe('Category Show')
    })
  })

  describe('New route', () => {
    it('「カテゴリー情報の登録」ページに遷移できること', async () => {
      await router.push('/categories/new')

      expect(router.currentRoute.value.meta.title).toBe('Category New')
      expect(document.title).toBe('Category New')
    })
  })

  describe('Edit route', () => {
    it('「カテゴリー情報の編集」ページに遷移できること', async () => {
      await router.push('/categories/1/edit')

      expect(router.currentRoute.value.meta.title).toBe('Category Edit')
      expect(document.title).toBe('Category Edit')
    })
  })
})
