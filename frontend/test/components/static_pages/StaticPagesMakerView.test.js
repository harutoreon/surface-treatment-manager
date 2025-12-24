import StaticPagesMakerView from '@/components/static_pages/StaticPagesMakerView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const pushMock = vi.fn()

vi.mock('axios')

vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock
      }
    }
  }
})

describe('StaticPagesMakerView', () => {
  let wrapper

  describe('ログインチェックに成功した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({  // ログインチェック
          status: 200
        })
        .mockResolvedValueOnce({  // メーカーリストの取得
          data: [
            { id: 1, name: '東亜電化工業株式会社' },
            { id: 2, name: '新星コーティングス' },
            { id: 3, name: '大和表面技術研究所' },
            { id: 4, name: '中央メッキ技研' },
            { id: 5, name: 'サンエース・フィニッシュ' },
            { id: 6, name: '瑞穂皮膜加工' },
            { id: 7, name: 'アストロ産業' },
            { id: 8, name: '明和サーフェス' },
            { id: 9, name: '富士理化研磨株式会社' },
            { id: 10, name: '高周波サーマル工業' },
          ]
        })

      wrapper = mount(StaticPagesMakerView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('メーカーリストページに移動すること', async () => {
      expect(wrapper.find('h3').text()).toBe('メーカー名で検索')
    })
  })

  describe('ログインチェックに失敗した場合', () => {
    beforeEach(async () => {
      axios.get.mockRejectedValue({  // ログインチェック
        response: {
          status: 401
        }
      })

      wrapper = mount(StaticPagesMakerView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('ログインページに移動すること', async () => {
      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: 'ログインが必要です。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/')
    })
  })

  describe('初期レンダリング', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({  // ログインチェック
          status: 200
        })
        .mockResolvedValueOnce({  // メーカーリストの取得
          data: [
            { id: 1, name: '東亜電化工業株式会社' },
            { id: 2, name: '新星コーティングス' },
            { id: 3, name: '大和表面技術研究所' },
            { id: 4, name: '中央メッキ技研' },
            { id: 5, name: 'サンエース・フィニッシュ' },
            { id: 6, name: '瑞穂皮膜加工' },
            { id: 7, name: 'アストロ産業' },
            { id: 8, name: '明和サーフェス' },
            { id: 9, name: '富士理化研磨株式会社' },
            { id: 10, name: '高周波サーマル工業' },
          ]
        })

      wrapper = mount(StaticPagesMakerView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出し表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('メーカー名で検索')
    })

    it('検索フォームが表示されること', () => {
      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // 入力要素
      expect(wrapper.find('input').exists()).toBe(true)

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('検索')
    })

    it('外部リンクが表示されること', () => {
      const routerLink = wrapper.findComponent(RouterLinkStub)

      expect(routerLink.props().to).toBe('/home')
      expect(routerLink.text()).toBe('メインメニューへ')
    })
  })

  describe('キーワードを入力して送信した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({  // ログインチェック
          status: 200
        })
        .mockResolvedValueOnce({  // メーカーリストの取得
          data: [
            { id: 1, name: '東亜電化工業株式会社' },
            { id: 2, name: '新星コーティングス' },
            { id: 3, name: '大和表面技術研究所' },
            { id: 4, name: '中央メッキ技研' },
            { id: 5, name: 'サンエース・フィニッシュ' },
            { id: 6, name: '瑞穂皮膜加工' },
            { id: 7, name: 'アストロ産業' },
            { id: 8, name: '明和サーフェス' },
            { id: 9, name: '富士理化研磨株式会社' },
            { id: 10, name: '高周波サーマル工業' },
          ]
        })

      wrapper = mount(StaticPagesMakerView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('検索結果のページに遷移されること', async () => {
      await wrapper.find('input').setValue('株式会社')
      await wrapper.find('form').trigger('submit.prevent')

      expect(pushMock).toHaveBeenCalledWith({
        name: 'SearchResults',
        params: { searchMethod: 'maker' },
        query: { keyword: '株式会社' }
      })
    })
  })

  describe('キーワードを未入力して送信した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({  // ログインチェック
          status: 200
        })
        .mockResolvedValueOnce({  // メーカーリストの取得
          data: [
            { id: 1, name: '東亜電化工業株式会社' },
            { id: 2, name: '新星コーティングス' },
            { id: 3, name: '大和表面技術研究所' },
            { id: 4, name: '中央メッキ技研' },
            { id: 5, name: 'サンエース・フィニッシュ' },
            { id: 6, name: '瑞穂皮膜加工' },
            { id: 7, name: 'アストロ産業' },
            { id: 8, name: '明和サーフェス' },
            { id: 9, name: '富士理化研磨株式会社' },
            { id: 10, name: '高周波サーマル工業' },
          ]
        })

      axios.get.mockRejectedValueOnce({
        status: 404
      })

      wrapper = mount(StaticPagesMakerView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('エラーメッセージが表示されること', async () => {
      expect(wrapper.find('p').exists()).toBe(false)

      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.find('p').exists()).toBe(true)
      expect(wrapper.find('p').text()).toBe('キーワードが未入力です')
    })
  })
})
