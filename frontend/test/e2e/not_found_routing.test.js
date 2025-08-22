import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect } from 'vitest'
import notFoundRoute from '@/router/routes/not_found'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [...notFoundRoute]
})

router.afterEach((to) => {
  const defaultTitle = 'surface-treatment-manager'
  document.title = to.meta?.title || defaultTitle
})

describe('NotFound routing', () => {
  it('「404」ページに遷移すること', async () => {
    await router.push('/non-existent-path')

    expect(router.currentRoute.value.meta.title).toBe('NotFound (404)')
    expect(document.title).toBe('NotFound (404)')
  })
})
