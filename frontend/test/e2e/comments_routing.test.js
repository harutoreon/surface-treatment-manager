import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect } from 'vitest'
import commentRoutes from '@/router/routes/comments'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [...commentRoutes]
})

router.afterEach((to) => {
  const defaultTitle = 'surface-treatment-manager'
  document.title = to.meta?.title || defaultTitle
})

describe('Comments routing', () => {
  describe('Index route', () => {
    it('「コメントリスト」ページに遷移すること', async () => {
      await router.push('/comments')

      expect(router.currentRoute.value.meta.title).toBe('Comments Index')
      expect(document.title).toBe('Comments Index')
    })
  })

  describe('Show route', () => {
    it('「コメント情報」ページに遷移すること', async () => {
      await router.push('/comments/1')

      expect(router.currentRoute.value.meta.title).toBe('Comments Show')
      expect(document.title).toBe('Comments Show')
    })
  })

  describe('New route', () => {
    it('「コメント情報の新規登録」ページに遷移すること', async () => {
      await router.push('/comments/new')

      expect(router.currentRoute.value.meta.title).toBe('Comments New')
      expect(document.title).toBe('Comments New')
    })
  })

  describe('Edit route', () => {
    it('「コメント情報の編集」ページに遷移すること', async () => {
      await router.push('/comments/1/edit')

      expect(router.currentRoute.value.meta.title).toBe('Comments Edit')
      expect(document.title).toBe('Comments Edit')
    })
  })
})
