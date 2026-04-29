import CategoriesEditView from '@/components/categories/CategoriesEditView.vue'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect,  vi, beforeEach } from 'vitest'
import axios from 'axios'

const replaceMock = vi.fn()
const pushMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', async () => {
  return {
    useRoute: () => {
      return {
        params: { id: 1 }
      }
    },
    useRouter: () => {
      return {
        push: pushMock,
        replace: replaceMock
      }
    }
  }
})

describe('CategoriesEditView', () => {
  const mockResponse = {
    id: 1,
    item: 'めっき',
    summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
  }

  const mountComponent = () => mount(CategoriesEditView, {
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
    it('カテゴリー情報の編集ページが表示されること', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ data: mockResponse })

      const wrapper = mountComponent()
      await flushPromises()

      // 見出し
      expect(wrapper.find('h3').text()).toBe('カテゴリー情報の編集')

      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      expect(wrapper.find('label[for="category-item"]').text()).toBe('カテゴリー名')
      expect(wrapper.find('label[for="category-summary"]').text()).toBe('概要')

      // 入力要素
      expect(wrapper.find('#category-item').exists()).toBe(true)
      expect(wrapper.find('#category-item').element.value).toBe('めっき')

      // テキストエリア要素
      expect(wrapper.find('#category-summary').exists()).toBe(true)
      expect(wrapper.find('#category-summary').element.value).toBe(
        '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
      )

      // ボタン要素
      const buttons = wrapper.findAll('button')
      const updateButton = buttons.find(
        button => button.text() === '更新')
      const cancelButton = buttons.find(
        button => button.text() === 'キャンセル')

      expect(updateButton.exists()).toBe(true)
      expect(cancelButton.exists()).toBe(true)
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockRejectedValueOnce({ response: { status: 404 } })

      const wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.emitted('message')).toBeTruthy()
      expect(wrapper.emitted('message')[0]).toEqual([
        { type: 'danger', text: 'カテゴリーの取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('有効な情報を送信した場合', () => {
    it('更新が成功すること', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ data: mockResponse })

      vi.mocked(axios.patch).mockResolvedValue({
        data: {
          id: 1,
          item: '陽極酸化',
          summary: '人工的にアルミニウム表面に分厚い酸化アルミニウム被膜を作る処理のこと。'
        }
      })

      const wrapper = mountComponent()
      await flushPromises()

      const inputItem = wrapper.find('#category-item')
      const inputSummary = wrapper.find('#category-summary')

      expect(inputItem.element.value).toBe('めっき')
      expect(inputSummary.element.value).toBe(
        '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
      )

      await inputItem.setValue('陽極酸化')
      await inputSummary.setValue(
        '人工的にアルミニウム表面に分厚い酸化アルミニウム被膜を作る処理のこと。'
      )

      await wrapper.find('form').trigger('submit')

      expect(wrapper.emitted('message')).toBeTruthy()
      expect(wrapper.emitted('message')[0]).toEqual([
        { type: 'success', text: 'カテゴリー情報を更新しました。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/categories/1')
    })
  })

  describe('無効な情報を送信した場合', () => {
    it('更新が失敗すること', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ data: mockResponse })

      vi.mocked(axios.patch).mockRejectedValue({ response: { status: 422 } })

      const wrapper = mountComponent()
      await flushPromises()

      const inputItem = wrapper.find('#category-item')
      const inputSummary = wrapper.find('#category-summary')

      expect(inputItem.element.value).toBe('めっき')
      expect(inputSummary.element.value).toBe(
        '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
      )

      await inputItem.setValue('')

      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(wrapper.find('.alert').text()).toBe('入力に不備があります。')
    })
  })

  describe('キャンセルボタンを押した場合', () => {
    it('/categories/1が呼び出されること', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ data: mockResponse })

      const wrapper = mountComponent()
      await flushPromises()

      const buttons = wrapper.findAll('button')
      const cancelButton = buttons.find(
        button => button.text() === 'キャンセル'
      )

      await cancelButton.trigger('click')
      await flushPromises()

      expect(pushMock).toHaveBeenCalledWith('/categories/1')
    })
  })
})
