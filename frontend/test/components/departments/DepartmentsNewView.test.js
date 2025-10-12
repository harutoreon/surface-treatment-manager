import DepartmentsNewView from '@/components/departments/DepartmentsNewView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const pushMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock
      }
    }
  }
})

describe('DepartmentsNewView', () => {
  let wrapper

  describe('ログインチェックに成功した場合', () => {
    it('部署情報の登録ページに移動すること', async () => {
      axios.get.mockResolvedValue({
        status: 200
      })

      wrapper = mount(DepartmentsNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('部署情報の登録')
    })
  })

  describe('ログインチェックに失敗した場合', () => {
    it('ログインページに移動すること', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 401
        }
      })

      wrapper = mount(DepartmentsNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: 'ログインが必要です。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/')
    })
  })

  describe('初期レンダリング', () => {
    beforeEach(async () => {
      axios.get.mockResolvedValue({
        status: 200
      })

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
      expect(wrapper.find('label').text()).toBe('部署名')

      // 入力要素
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

  describe('部署の登録処理', () => {
    describe('有効な情報を送信した場合', () => {
      beforeEach(async () => {
        axios.get.mockResolvedValue({
          status: 200
        })

        axios.post.mockResolvedValue({
          data: {
            id: 1,
            name: '品質管理部'
          }
        })

        wrapper = mount(DepartmentsNewView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()
      })

      it('登録に成功すること', async () => {
        await wrapper.find('#department-name').setValue('品質管理部')
        await wrapper.find('form').trigger('submit.prevent')

        expect(wrapper.emitted()).toHaveProperty('message')
        expect(wrapper.emitted().message[0]).toEqual([
          { type: 'success', text: '部署を1件登録しました。' }
        ])
        expect(pushMock).toHaveBeenCalledWith('/departments/1')
      })
    })

    describe('無効な情報を送信した場合', () => {
      beforeEach(async () => {
        axios.get.mockResolvedValue({
          status: 200
        })

        axios.post.mockRejectedValue({
          response: {
            status: 422
          }
        })

        wrapper = mount(DepartmentsNewView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()
      })

      it('登録に失敗すること', async () => {
        await wrapper.find('#department-name').setValue('')
        await wrapper.find('form').trigger('submit.prevent')

        expect(wrapper.text()).toContain('入力に不備があります。')
      })
    })
  })
})
