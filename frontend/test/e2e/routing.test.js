import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import router from '@/router'

describe('Makers routing', () => {
  it('「メーカーリスト」ページに遷移できること', async () => {
    router.push('/makers')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.html()).toContain('メーカーリスト')
  })

  it('「メーカー情報」ページに遷移できること', async () => {
    router.push('makers/1')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.html()).toContain('メーカー情報')
  })
})
