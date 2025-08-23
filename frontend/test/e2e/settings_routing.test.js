import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect } from 'vitest'
import settingsRoutes from '@/router/routes/settings'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [...settingsRoutes]
})

router.afterEach((to) => {
  const defaultTitle = 'surface-treatment-manager'
  document.title = to.meta?.title || defaultTitle
})

describe('Settings routing', () => {
  it('「アプリケーションの管理」ページに遷移すること', async () => {
    await router.push('/settings')

    expect(router.currentRoute.value.meta.title).toBe('Settings')
    expect(document.title).toBe('Settings')
  })
})
