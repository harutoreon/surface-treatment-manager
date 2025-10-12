import DepartmentsIndexView from '@/components/departments/DepartmentsIndexView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const replaceMock = vi.fn()
const pushMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        replace: replaceMock,
        push: pushMock
      }
    }
  }
})

describe('DepartmentsIndexView', () => {
  let wrapper

  describe('ログインチェックに成功した場合', () => {
    it('部署リストページに移動すること', async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          status: 200
        })

      wrapper = mount(DepartmentsIndexView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('部署リスト')
    })
  })

  describe('ログインチェックに失敗した場合', () => {
    it('ログインページに移動すること', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 401
        }
      })

      wrapper = mount(DepartmentsIndexView, {
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
      expect(pushMock).not.toHaveBeenCalledWith('/departments')
    })
  })

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '品質管理部' },
            { id: 2, name: '製造部' },
            { id: 3, name: '開発部' },
            { id: 4, name: '営業部' }
          ]
        })

      wrapper = mount(DepartmentsIndexView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('部署リスト')      
    })

    it('部署名の一覧が表示されること', () => {
      const links = wrapper.findAllComponents(RouterLinkStub)
      
      // to属性
      expect(links[0].props().to).toBe('/departments/1')
      expect(links[1].props().to).toBe('/departments/2')
      expect(links[2].props().to).toBe('/departments/3')
      expect(links[3].props().to).toBe('/departments/4')

      // テキスト
      expect(links[0].text()).toBe('品質管理部')
      expect(links[1].text()).toBe('製造部')
      expect(links[2].text()).toBe('開発部')
      expect(links[3].text()).toBe('営業部')
    })

    it('外部リンクが表示されること', () => {
      const div = wrapper.find('div[class="d-flex justify-content-evenly"]')
      const routerLinks = div.findAllComponents(RouterLinkStub)

      // // to属性
      expect(routerLinks[0].props().to).toBe('/departments/new')
      expect(routerLinks[1].props().to).toBe('/home')

      // // テキスト
      expect(routerLinks[0].text()).toBe('部署情報の登録へ')
      expect(routerLinks[1].text()).toBe('メインメニューへ')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockRejectedValueOnce({
          response: {
            status: 404
          }
        })

      wrapper = mount(DepartmentsIndexView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('404ページに遷移すること', async () => {
      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: '部署リストの取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })
})