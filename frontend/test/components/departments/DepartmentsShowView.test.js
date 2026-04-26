import DepartmentsShowView from '@/components/departments/DepartmentsShowView.vue'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const replaceMock = vi.fn()
const pushMock = vi.fn()

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
        replace: replaceMock,
        push: pushMock
      }
    }
  }
})

describe('DepartmentsShowView', () => {
  let wrapper

  const mockResponse = {
    id: 1,
    name: '品質管理部'
  }

  const mountComponent = () => mount(DepartmentsShowView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('confirm', vi.fn(() => true))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })  // ログインチェック
        .mockResolvedValueOnce({ data: mockResponse })  // fetchDepartmentData()

      wrapper = mountComponent()
      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('部署情報')
    })

    it('部署名が表示されること', () => {
      const departmentInfoItem = wrapper.find('.list-group-item')

      expect(departmentInfoItem.text()).toContain('部署名 :')
      expect(departmentInfoItem.text()).toContain('品質管理部')
    })

    it('外部リンクが表示されること', () => {
      const routerLinks = wrapper.findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLinks[0].props().to).toBe('/departments/1/edit')
      expect(routerLinks[1].props().to).toBe('/departments')

      // テキスト
      expect(routerLinks[0].text()).toBe('部署情報の編集へ')
      expect(routerLinks[1].text()).toBe('部署リストへ')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })  // ログインチェック
        .mockRejectedValueOnce({ response: { status: 404 } })  // fetchDepartmentData()

      wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.emitted('message')).toBeTruthy()
      expect(wrapper.emitted('message')[0]).toEqual([
        { type: 'danger', text: '部署情報の取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('削除処理に成功した場合', () => {
    beforeEach(async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })  // ログインチェック
        .mockResolvedValueOnce({ data: mockResponse })  // fetchDepartmentData()

      vi.mocked(axios.delete).mockResolvedValueOnce({ status: 204 })

      wrapper = mountComponent()
      await flushPromises()
    })

    it('部署リストページに遷移すること', async () => {
      await wrapper.find('button').trigger('click')
      await flushPromises()

      expect(wrapper.emitted('message')).toBeTruthy()
      expect(wrapper.emitted('message')[0]).toEqual([
        { type: 'success', text: '部署情報を1件削除しました。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/departments')      
    })
  })

  describe('削除処理に失敗した場合', () => {
    beforeEach(async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })  // ログインチェック
        .mockResolvedValueOnce({ data: mockResponse })  // fetchDepartmentData()

      vi.mocked(axios.delete)
        .mockRejectedValue({ response: { status: 404 } })

      wrapper = mountComponent()
      await flushPromises()
    })

    it('404ページに遷移すること', async () => {
      await wrapper.find('button').trigger('click')
      await flushPromises()

      expect(wrapper.emitted('message')).toBeTruthy()
      expect(wrapper.emitted('message')[0]).toEqual([
        { type: 'danger', text: '削除処理に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })
})