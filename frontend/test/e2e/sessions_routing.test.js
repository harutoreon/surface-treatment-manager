import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect } from 'vitest'
import sessionRoutes from '@/router/routes/sessions'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [...sessionRoutes]
})

router.afterEach((to) => {
  const defaultTitle = 'surface-treatment-manager'
  document.title = to.meta?.title || defaultTitle
})


describe('Login routing', () => {
  it('「ログイン」ページに遷移すること', async () => {
    await router.push('/')

    expect(router.currentRoute.value.meta.title).toBe('Login')
    expect(document.title).toBe('Login')
  })
})
