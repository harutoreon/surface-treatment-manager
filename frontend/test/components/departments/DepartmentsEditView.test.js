import DepartmentsEditView from '@/components/departments/DepartmentsEditView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

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
        push: pushMock
      }
    }
  }
})

describe('DepartmentsEditView', () => {
  const mountComponent = () => mount(DepartmentsEditView, {
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
    it('編集フォームが表示されること', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })  // ログインチェック
        .mockResolvedValueOnce({ data: { id: 1, name: '品質管理部' } })  // fetchDepartmentData()

      const wrapper = mountComponent()
      await flushPromises()

      // 見出し
      expect(wrapper.find('h3').text()).toBe('部署情報の編集')

      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      expect(wrapper.find('label').text()).toBe('部署名')

      // 入力要素と値
      expect(wrapper.find('#department-name').exists()).toBe(true)
      expect(wrapper.find('#department-name').element.value).toBe('品質管理部')

      // ボタン要素
      const buttons = wrapper.findAll('button')
      expect(buttons[0].text()).toBe('更新')
      expect(buttons[1].text()).toBe('キャンセル')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    it('ログインページに遷移すること', async () => {
      vi.mocked(axios.get).mockRejectedValue({ response: { status: 401 } })  // ログインチェック

      const wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.emitted('message')).toBeTruthy()
      expect(wrapper.emitted('message')[0]).toEqual([
        { type: 'danger', text: 'ログインが必要です。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/')
    })
  })

  describe('有効な情報を送信した場合', () => {
    it('更新が成功すること', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })  // ログインチェック
        .mockResolvedValueOnce({ data: { id: 1, name: '品質管理部' } })  // fetchDepartmentData()

      vi.mocked(axios.patch).mockResolvedValue({ data: { id: 1, name: '人事部' } })

      const wrapper = mountComponent()
      await flushPromises()

      await wrapper.find('#department-name').setValue('人事部')
      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(wrapper.emitted('message')).toBeTruthy()
      expect(wrapper.emitted('message')[0]).toEqual([
        { type: 'success', text: '部署情報を更新しました。' }
      ])
      expect(vi.mocked(axios.patch)).toHaveBeenCalledWith(
        expect.stringContaining('/departments/1'),
        { name: '人事部' }
      )
      expect(pushMock).toHaveBeenCalledWith('/departments/1')
    })
  })

  describe('無効な情報を送信した場合', () => {
    it('更新が失敗すること', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })  // ログインチェック
        .mockResolvedValueOnce({ data: { id: 1, name: '品質管理部' } })  // fetchDepartmentData()

      vi.mocked(axios.patch).mockRejectedValue({ response: { status: 422 } })

      const wrapper = mountComponent()
      await flushPromises()

      await wrapper.find('#department-name').setValue('')
      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(vi.mocked(axios.patch)).toHaveBeenCalledWith(
        expect.stringContaining('/departments/1'),
        { name: '' }
      )
      expect(wrapper.find('.alert').text()).toBe('入力に不備があります。')
    })
  })

  describe('キャンセルボタンを押した場合', () => {
    it('部署の詳細ページに遷移すること', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })  // ログインチェック
        .mockResolvedValueOnce({ data: { id: 1, name: '品質管理部' } })  // fetchDepartmentData()

      const wrapper = mountComponent()
      await flushPromises()

      const cancelButton = wrapper.find('.btn-outline-secondary')
      await cancelButton.trigger('click')
      await flushPromises()

      expect(pushMock).toHaveBeenCalledWith('/departments/1')
    })
  })
})