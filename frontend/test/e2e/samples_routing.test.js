import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect } from 'vitest'
import sampleRoutes from '@/router/routes/samples'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [...sampleRoutes]
})

router.afterEach((to) => {
  const defaultTitle = 'surface-treatment-manager'
  document.title = to.meta?.title || defaultTitle
})

describe('Samples routing', () => {
  describe('Index route', () => {
    it('「表面処理リスト」ページに遷移すること', async () => {
      await router.push('/samples')

      expect(router.currentRoute.value.meta.title).toBe('Sample Index')
      expect(document.title).toBe('Sample Index')
    })
  })

  describe('Show route', () => {
    it('「表面処理情報」ページに遷移すること', async () => {
      await router.push('/samples/1')

      expect(router.currentRoute.value.meta.title).toBe('Sample Show')
      expect(document.title).toBe('Sample Show')
    })
  })

  describe('New route', () => {
    it('「表面処理情報の登録」ページに遷移すること', async () => { 
      await router.push('/samples/new')

      expect(router.currentRoute.value.meta.title).toBe('Sample New')
      expect(document.title).toBe('Sample New')
    })
  })

  describe('Edit route', () => {
    it('「表面処理情報の編集」ページに遷移すること', async () => {
      await router.push('/samples/1/edit')

      expect(router.currentRoute.value.meta.title).toBe('Sample Edit')
      expect(document.title).toBe('Sample Edit')
    })
  })
})
