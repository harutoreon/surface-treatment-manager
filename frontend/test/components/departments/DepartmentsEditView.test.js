import DepartmentsEditView from '@/components/departments/DepartmentsEditView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const replaceMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        params: { id: 1 }
      }
    },
    useRouter: () => {
      return {
        replace: replaceMock
      }
    }
  }
})

describe('DepartmentsEditView', () => {
  let wrapper

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      axios.get.mockResolvedValue({
        data: {
          id: 1,
          name: '品質管理部'
        }
      })

      wrapper = mount(DepartmentsEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('部署情報の編集')
    })

    it('部署情報が表示されること', () => {
      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      expect(wrapper.find('label').text()).toBe('部署名')

      // 入力要素と値
      expect(wrapper.find('#department-name').exists()).toBe(true)
      expect(wrapper.find('#department-name').element.value).toBe('品質管理部')

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('更新')
    })

    it('外部リンクが表示されること', () => {
      const routerLink = wrapper.findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLink[0].props().to).toBe('/departments/1')
      expect(routerLink[1].props().to).toBe('/departments')

      // テキスト
      expect(routerLink[0].text()).toBe('部署情報へ')
      expect(routerLink[1].text()).toBe('部署リストへ')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 404
        }
      })

      wrapper = mount(DepartmentsEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: '部署情報の取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })
})