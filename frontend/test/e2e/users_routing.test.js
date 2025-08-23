import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect } from 'vitest'
import userRoutes from '@/router/routes/users'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [...userRoutes]
})

router.afterEach((to) => {
  const defaultTitle = 'surface-treatment-manager'
  document.title = to.meta?.title || defaultTitle
})

describe('Users routing', () => {
  describe('Index route', () => {
    it('「ユーザーリスト」ページに遷移すること', async () => {
      await router.push('/users')

      expect(router.currentRoute.value.meta.title).toBe('User Index')
      expect(document.title).toBe('User Index')
    })
  })

  describe('Show route', () => {
    it('「ユーザー情報」ページに遷移すること', async () => {
      await router.push('/users/1')

      expect(router.currentRoute.value.meta.title).toBe('User Show')
      expect(document.title).toBe('User Show')
    })
  })

  describe('New route', () => {
    it('「ユーザー情報の登録」ページに遷移すること', async () => {
      await router.push('/users/new')

      expect(router.currentRoute.value.meta.title).toBe('User New')
      expect(document.title).toBe('User New')
    })
  })

  describe('Edit route', () => {
    it('「ユーザー情報の編集」ページに遷移すること', async () => {
      await router.push('/users/1/edit')

      expect(router.currentRoute.value.meta.title).toBe('User Edit')
      expect(document.title).toBe('User Edit')
    })
  })
})
