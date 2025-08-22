import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import notFoundRoute from '@/router/routes/not_found'
import App from '@/App.vue'

const routes = [
  ...notFoundRoute,
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

describe('NotFound routing', () => {
  let router

  beforeEach(() => {
    router = createAppRouter()
  })

  it('「404」ページに遷移すること', async () => {
    router.push('/non-existent-path')

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

    expect(router.currentRoute.value.meta.title).toBe('NotFound (404)')
    expect(document.title).toBe('NotFound (404)')
    expect(wrapper.find('h1').text()).toBe('404')
  })
})
