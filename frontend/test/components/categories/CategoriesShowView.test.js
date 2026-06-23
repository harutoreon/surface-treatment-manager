import CategoriesShowView from '@/components/categories/CategoriesShowView.vue'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'

const pushMock = vi.fn()
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
        replace: replaceMock,
        push: pushMock
      }
    }
  }
})

describe('CategoriesShowView', () => {
  const mockResponse = {
    id: 1,
    item: 'めっき',
    summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
  }

  const mockSampleResponse = [
    {
      id: 1,
      name: 'sample name',
      color: 'sample color',
      hardness: 'sample hardness',
      film_thickness: 'sample film_thickness',
      feature: 'sample feature',
      summary: 'sample summary',
      maker_id: 1,
      category_id: 1,
    }
  ]

  const mountComponent = () => mount(CategoriesShowView, {
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
    it('カテゴリー情報ページが表示されること', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ data: mockResponse })
        .mockResolvedValueOnce({ data: mockSampleResponse })

      const wrapper = mountComponent()
      await flushPromises()

      // 見出し
      expect(wrapper.find('h3').text()).toBe('カテゴリー情報')

      // カテゴリー名
      expect(wrapper.text()).toContain('めっき')

      // 概要
      expect(wrapper.text()).toContain('金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。')

      // サンプル件数
      expect(wrapper.find('#category-samples').text()).toBe('1')

      // 外部リンク
      const routerLinks = wrapper.findAllComponents(RouterLinkStub)
      const editLink = routerLinks.find(element => element.props().to === '/categories/1/edit')
      const listLink = routerLinks.find(element => element.props().to === '/categories')

      expect(editLink.text()).toBe('カテゴリー情報の編集')
      expect(listLink.text()).toBe('カテゴリーリストへ')

      // 削除ボタン
      expect(wrapper.find('button').text()).toBe('カテゴリー情報の削除')
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

  describe('カテゴリー情報の削除に成功した場合', () => {
    it('カテゴリーリストページに遷移すること', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ data: mockResponse })
        .mockResolvedValueOnce({ data: mockSampleResponse })

      vi.mocked(axios.delete).mockResolvedValueOnce({ status: 204 })

      const wrapper = mountComponent()
      await flushPromises()

      await wrapper.find('button').trigger('click')
      await flushPromises()

      expect(wrapper.emitted('message')).toBeTruthy()
      expect(wrapper.emitted('message')[0]).toEqual([
        { type: 'success', text: 'カテゴリーを1件削除しました。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/categories')
    })
  })

  describe('カテゴリー情報の削除に失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ data: mockResponse })
        .mockResolvedValueOnce({ data: mockSampleResponse })

      vi.mocked(axios.delete).mockRejectedValue({ response: { status: 404 } })

      const wrapper = mountComponent()
      await flushPromises()
      
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
