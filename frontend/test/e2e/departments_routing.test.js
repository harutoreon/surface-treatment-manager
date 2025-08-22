import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect } from 'vitest'
import departmentRoutes from '@/router/routes/departments'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [...departmentRoutes]
})

router.afterEach((to) => {
  const defaultTitle = 'surface-treatment-manager'
  document.title = to.meta?.title || defaultTitle
})

describe('Departments routing', () => {
  describe('Index route', () => {
    it('「部署リスト」ページに遷移できること', async () => {
      await router.push('/departments')

      expect(router.currentRoute.value.meta.title).toBe('Department Index')
      expect(document.title).toBe('Department Index')
    })
  })

  describe('Show route', () => {
    it('「部署情報」ページに遷移できること', async () => {
      await router.push('/departments/1')

      expect(router.currentRoute.value.meta.title).toBe('Department Show')
      expect(document.title).toBe('Department Show')
    })
  })

  describe('New route', () => {
    it('「部署情報の登録」ページに遷移できること', async () => {
      await router.push('/departments/new')

      expect(router.currentRoute.value.meta.title).toBe('Department New')
      expect(document.title).toBe('Department New')
    })
  })

  describe('Edit route', () => {
    it('「部署情報の編集」ページに遷移できること', async () => {
      await router.push('/departments/1/edit')

      expect(router.currentRoute.value.meta.title).toBe('Department Edit')
      expect(document.title).toBe('Department Edit')
    })
  })
})
