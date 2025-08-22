import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import sessionRoutes from '@/router/routes/sessions'
import App from '@/App.vue'

const routes = [
  ...sessionRoutes,
]

function createAppRouter() {
  const history = createMemoryHistory()
  const router = createRouter({
    history,
    routes,
  })

  router.afterEach((to) => {
    const defaultTitle = 'surface-treatment-manager'
    document.title = to.meta?.title || defaultTitle
  })

  return router
}

describe('Login routing', () => {
  let router

  beforeEach(() => {
    router = createAppRouter()
  })

  it('「ログイン」ページに遷移すること', async () => {
    router.push('/')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Login')
    expect(document.title).toBe('Login')
    expect(wrapper.find('h3').text()).toBe('ログイン')
  })
})
