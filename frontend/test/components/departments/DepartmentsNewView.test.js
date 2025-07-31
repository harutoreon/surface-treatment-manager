import DepartmentsNewView from '@/components/departments/DepartmentsNewView.vue'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'

describe('DepartmentsNewView', () => {
  let wrapper

  describe('初期レンダリング', () => {
    beforeEach(async () => {
      wrapper = mount(DepartmentsNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('部署情報の登録')
    })

    it('入力フォームが表示されること', () => {
      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      expect(wrapper.find('#department-name').exists()).toBe(true)

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('登録')
    })

    it('外部リンクが表示されること', () => {
      const routerlink = wrapper.findComponent(RouterLinkStub)

      expect(routerlink.props().to).toBe('/departments')
      expect(routerlink.text()).toBe('部署リストへ')
    })
  })
})