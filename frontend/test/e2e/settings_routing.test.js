import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import settingsRoutes from '@/router/routes/settings'
import App from '@/App.vue'

const routes = [
  ...settingsRoutes,
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

describe('Settings routing', () => {
  let router

  beforeEach(() => {
    router = createAppRouter()
  })

  it('「アプリケーションの管理」ページに遷移すること', async () => {
    router.push('/settings')

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

    expect(router.currentRoute.value.meta.title).toBe('Settings')
    expect(document.title).toBe('Settings')
    expect(wrapper.find('h3').text()).toBe('アプリケーションの管理')
  })
})
