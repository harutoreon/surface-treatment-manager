import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import departmentRoutes from '@/router/routes/departments'
import App from '@/App.vue'

const routes = [
  ...departmentRoutes,
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

describe('Departments routing', () => {
  let router

  beforeEach(() => {
    router = createAppRouter()
  })

  it('「部署リスト」ページに遷移できること', async () => {
    router.push('/departments')

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

    expect(router.currentRoute.value.meta.title).toBe('Department Index')
    expect(document.title).toBe('Department Index')
    expect(wrapper.find('h3').text()).toBe('部署リスト')
  })

  it('「部署情報」ページに遷移できること', async () => {
    router.push('/departments/1')

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

    expect(router.currentRoute.value.meta.title).toBe('Department Show')
    expect(document.title).toBe('Department Show')
    expect(wrapper.find('h3').text()).toBe('部署情報')
  })

  it('「部署情報の登録」ページに遷移できること', async () => {
    router.push('/departments/new')

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

    expect(router.currentRoute.value.meta.title).toBe('Department New')
    expect(document.title).toBe('Department New')
    expect(wrapper.find('h3').text()).toBe('部署情報の登録')
  })

  it('「部署情報の編集」ページに遷移できること', async () => {
    router.push('/departments/1/edit')

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

    expect(router.currentRoute.value.meta.title).toBe('Department Edit')
    expect(document.title).toBe('Department Edit')
    expect(wrapper.find('h3').text()).toBe('部署情報の編集')
  })
})
