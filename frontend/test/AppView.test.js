import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'

describe('App.vue', () => {
  let App
  let wrapper

  const mountWithRoute = async (path) => {
    vi.resetModules()

    vi.doMock('vue-router', () => ({
      useRoute: () => ({ path }),
    }))

    const module = await import('@/App.vue')
    App = module.default

    wrapper = mount(App, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
          RouterView: {
            template: '<div class="router-view-stub" />',
          },
        },
      },
    })

    await flushPromises()
  }

  describe('初期レンダリング', () => {
    describe('pathが/homeの場合', () => {
      beforeEach(async () => {
        await mountWithRoute('/home')
      })

      it('headerが表示されること', () => {
        expect(wrapper.find('header').exists()).toBe(true)
      })

      it('RouterViewが表示されること', () => {
        expect(wrapper.find('.router-view-stub').exists()).toBe(true)
      })
    })

    describe('pathが/の場合', () => {
      beforeEach(async () => {
        await mountWithRoute('/')
      })

      it('headerが表示されないこと', async () => {
        expect(wrapper.find('header').exists()).toBe(false)
      })

      it('RouterViewが表示されること', () => {
        expect(wrapper.find('.router-view-stub').exists()).toBe(true)
      })
    })
  })

  describe('フラッシュメッセージの表示', () => {
    beforeEach(async () => {
      await mountWithRoute('/home')
    })

    describe('messageがある場合', () => {
      it('メッセージが表示されること', async () => {
        await wrapper.vm.showMessage({ type: 'success', text: '保存しました。' })

        expect(wrapper.find('div.alert-success').exists()).toBe(true)
        expect(wrapper.find('div.alert-success').text()).toBe('保存しました。')
      })

      it('閉じるボタンを押すとメッセージが消えること', async () => {
        await wrapper.vm.showMessage({ type: 'success', text: '保存しました。' })
        await wrapper.find('button').trigger('click')

        expect(wrapper.find('div.alert-success').exists()).toBe(false)
      })
    })

    describe('messageが空の場合', () => {
      it('メッセージが表示されないこと', () => {
        expect(wrapper.find('div.alert-success').exists()).toBe(false)
      })
    })
  })
})
