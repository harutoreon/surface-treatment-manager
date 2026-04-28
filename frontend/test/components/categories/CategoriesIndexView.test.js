import CategoriesIndexView from '@/components/categories/CategoriesIndexView.vue'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { useRouter } from 'vue-router'

vi.mock('axios')
vi.mock('vue-router')

describe('CategoriesIndexView', () => {
  // let wrapper

  const mockResponse = [
    {
      id: 1,
      item: 'めっき',
      summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
    }
  ]

  const mountComponent = () => mount(CategoriesIndexView, {
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
    it('カテゴリーリストページが表示されること', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ data: mockResponse })

      const wrapper = mountComponent()
      await flushPromises()

      // 見出し
      expect(wrapper.find('h3').text()).toBe('カテゴリーリスト')

      // ラベル
      expect(wrapper.text()).toContain('めっき')

      // 概要文
      expect(wrapper.text()).toContain('金属または非金属の材...')

      // 外部リンク
      const routerLinks = wrapper.find('ul').findAllComponents(RouterLinkStub)
      const newLink = routerLinks.find(element => element.props().to === '/categories/new')
      const homeLink = routerLinks.find(element => element.props().to === '/home')

      expect(newLink.text()).toBe('カテゴリー情報の登録')
      expect(homeLink.text()).toBe('メインメニューへ')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      const replaceMock = vi.fn()

      vi.mocked(useRouter).mockReturnValue({ replace: replaceMock })
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
})
