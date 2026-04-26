import DepartmentsIndexView from '@/components/departments/DepartmentsIndexView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const replaceMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: vi.fn(),
    useRouter: () => {
      return {
        replace: replaceMock
      }
    }
  }
})

describe('DepartmentsIndexView', () => {
  let wrapper

  const mockResponse = [
    { id: 1, name: '品質管理部' }
  ]

  const mountComponent = () => mount(DepartmentsIndexView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })  // ログインチェック
        .mockResolvedValueOnce({ data: mockResponse })  // fetchDepartmentList()

      wrapper = mountComponent()
      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('部署リスト')      
    })

    it('部署名の一覧が表示されること', () => {
      const routerLink = wrapper.findComponent(RouterLinkStub)

      // to属性
      expect(routerLink.props().to).toBe('/departments/1')

      // テキスト
      expect(routerLink.text()).toBe('品質管理部')
    })

    it('外部リンクが表示されること', () => {
      const ul = wrapper.find('.nav')
      const routerLinks = ul.findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLinks[0].props().to).toBe('/departments/new')
      expect(routerLinks[1].props().to).toBe('/home')

      // テキスト
      expect(routerLinks[0].text()).toBe('部署情報の登録へ')
      expect(routerLinks[1].text()).toBe('メインメニューへ')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    beforeEach(async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })  // ログインチェック
        .mockRejectedValueOnce({ response: { status: 404 } })  // fetchDepartmentList()

      wrapper = mountComponent()
      await flushPromises()
    })

    it('404ページに遷移すること', async () => {
      expect(wrapper.emitted('message')).toBeTruthy()
      expect(wrapper.emitted('message')[0]).toEqual([
        { type: 'danger', text: '部署リストの取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })
})