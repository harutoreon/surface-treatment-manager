import App from '@/App.vue'
import { describe, it, expect, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'

describe('App.vue', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = mount(App, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
          RouterView: {
            template: '<div class="router-view-stub" />'
          }
        }
      }
    })

    await flushPromises()
  })

  describe('初期レンダリング', () => {
    it('headerが表示されること', () => {
      const headerElement = wrapper.find('header')

      expect(headerElement.findComponent('nav div a').text()).toBe('Surface Treatment Manager')
      expect(headerElement.findComponent('nav div a').props().to).toBe('/home')
    })

    it('RouterViewが表示されること', () => {
      expect(wrapper.find('.router-view-stub').exists()).toBe(true)
    })
  })

  describe('フラッシュメッセージの表示', () => {
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