import DepartmentsIndexView from '@/components/departments/DepartmentsIndexView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const replaceMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        replace: replaceMock
      }
    }
  }
})

describe('DepartmentsIndexView', () => {
  let wrapper

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      axios.get.mockResolvedValue({
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
      const links = wrapper.findAllComponents(RouterLinkStub)

      // // to属性
      expect(links[4].props().to).toBe('/departments/new')
      expect(links[5].props().to).toBe('/home')

      // // テキスト
      expect(links[4].text()).toBe('部署の登録へ')
      expect(links[5].text()).toBe('メインメニューへ')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    beforeEach(async () => {
      axios.get.mockRejectedValue({
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