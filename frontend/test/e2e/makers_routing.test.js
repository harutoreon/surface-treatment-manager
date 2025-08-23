import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect } from 'vitest'
import makerRoutes from '@/router/routes/makers'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [...makerRoutes]
})

router.afterEach((to) => {
  const defaultTitle = 'surface-treatment-manager'
  document.title = to.meta?.title || defaultTitle
})

describe('Makers routing', () => {
  describe('Index route', () => {
    it('「メーカーリスト」ページに遷移できること', async () => {
      await router.push('/makers')

      expect(router.currentRoute.value.meta.title).toBe('Maker Index')
      expect(document.title).toBe('Maker Index')
    })
  })

  describe('Show route', () => {
    it('「メーカー情報」ページに遷移できること', async () => {
      await router.push('/makers/1')

      expect(router.currentRoute.value.meta.title).toBe('Maker Show')
      expect(document.title).toBe('Maker Show')
    })
  })
  
  describe('New route', () => {
    it('「メーカー情報の登録」ページに遷移すること', async () => {
      await router.push('/makers/new')

      expect(router.currentRoute.value.meta.title).toBe('Maker New')
      expect(document.title).toBe('Maker New')
    })
  })

  describe('Edit route', () => {
    it('「メーカー情報の編集」ページに遷移すること', async () => {
      await router.push('/makers/1/edit')

      expect(router.currentRoute.value.meta.title).toBe('Maker Edit')
      expect(document.title).toBe('Maker Edit')
    })
  })
})
