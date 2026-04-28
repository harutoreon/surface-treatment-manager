import CategoriesNewView from '@/components/categories/CategoriesNewView.vue'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
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

describe('CategoriesNewView', () => {
  const mockResponse = {
    id: 1,
    item: 'めっき',
    summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
  }

  const mountComponent = () => mount(CategoriesNewView, {
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
    it('カテゴリー情報の登録ページが表示されること', async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ status: 200 })

      const wrapper = mountComponent()
      await flushPromises()

      // 見出し
      expect(wrapper.find('h3').text()).toBe('カテゴリー情報の登録')

      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      expect(wrapper.find('label[for="category-item"]').text()).toBe('カテゴリー名')
      expect(wrapper.find('label[for="category-summary"]').text()).toBe('概要')

      // 入力要素・テキストエリア要素
      expect(wrapper.find('#category-item').exists()).toBe(true)
      expect(wrapper.find('#category-summary').exists()).toBe(true)

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('登録')

      // 外部リンク
      const routerLink = wrapper.findComponent(RouterLinkStub)
      expect(routerLink.props().to).toBe('/categories')
      expect(routerLink.text()).toBe('カテゴリーリストへ')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    it('ログインページに遷移すること', async () => {
      vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 401 } })

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
    it('登録に成功すること', async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ status: 200 })
      vi.mocked(axios.post).mockResolvedValueOnce({ data: mockResponse })

      const wrapper = mountComponent()
      await flushPromises()

      await wrapper.find('#category-item').setValue('めっき')
      await wrapper.find('#category-summary').setValue(
        '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
      )

      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(wrapper.emitted('message')).toBeTruthy()
      expect(wrapper.emitted('message')[0]).toEqual([
        { type: 'success', text: 'カテゴリーを1件登録しました。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/categories/1')
    })
  })

  describe('無効な情報を送信した場合', () => {
    it('登録に失敗すること', async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ status: 200 })
      vi.mocked(axios.post).mockRejectedValueOnce({ response: { status: 422 } })

      const wrapper = mountComponent()
      await flushPromises()

      await wrapper.find('#category-item').setValue('')
      await wrapper.find('#category-summary').setValue(
        '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
      )

      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(wrapper.find('.alert').text()).toBe('入力に不備があります。')
    })
  })
})
