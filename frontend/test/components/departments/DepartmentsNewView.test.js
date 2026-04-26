import DepartmentsNewView from '@/components/departments/DepartmentsNewView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const pushMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: vi.fn(),
    useRouter: () => {
      return {
        push: pushMock
      }
    }
  }
})

describe('DepartmentsNewView', () => {
  let wrapper

  const mountComponent = () => mount(DepartmentsNewView, {
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
      vi.mocked(axios.get).mockResolvedValue({ status: 200 })  // ログインチェック

      wrapper = mountComponent()
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

  describe('初期レンダリングに失敗した場合', () => {
    beforeEach(async () => {
      vi.mocked(axios.get).mockRejectedValue({ response: { status: 401 } })

      wrapper = mountComponent()
      await flushPromises()
    })

    it('ログインページに遷移すること', async () => {
      expect(wrapper.emitted('message')).toBeTruthy()
      expect(wrapper.emitted('message')[0]).toEqual([
        { type: 'danger', text: 'ログインが必要です。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/')
    })
  })

  describe('入力フォームから有効な情報を送信した場合', () => {
    beforeEach(async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ status: 200 })  // ログインチェック
      vi.mocked(axios.post).mockResolvedValueOnce({ data: { id: 1, name: '品質管理部' } })

      wrapper = mountComponent()
      await flushPromises()
    })

    it('登録に成功すること', async () => {
      await wrapper.find('#department-name').setValue('品質管理部')
      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(wrapper.emitted('message')).toBeTruthy()
      expect(wrapper.emitted('message')[0]).toEqual([
        { type: 'success', text: '部署を1件登録しました。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/departments/1')
    })
  })

  describe('入力フォームから無効な情報を送信した場合', () => {
    beforeEach(async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ status: 200 })  // ログインチェック
      vi.mocked(axios.post).mockRejectedValueOnce({ response: { status: 422 } })

      wrapper = mountComponent()
      await flushPromises()
    })

    it('登録に失敗すること', async () => {
      await wrapper.find('#department-name').setValue('')
      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(wrapper.find('.alert').text()).toBe('入力に不備があります。')
    })
  })
})
