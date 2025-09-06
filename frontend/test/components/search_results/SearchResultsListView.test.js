import SearchResultsListView from '@/components/search_results/SearchResultsListView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
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

describe('SearchResultsListView', () => {
  let wrapper

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({
          data: [
            { id: 1 }
          ]      
        })
  
        .mockResolvedValueOnce({
          data: {
            id: 1,
            name: '無電解ニッケルめっき',
            image_url: 'http://localhost:3000/electroless_nickel_plating.jpeg',
            summary: '電気を使わず化学反応で金属表面にニッケルを析出する技術です。'
          }
        })
  
      wrapper = mount(SearchResultsListView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })
  
      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('表面処理一覧')
    })

    it('アルバムが表示されること', () => {
      const cardDiv = wrapper.find('div.card')

      // アルバムクラス
      expect(wrapper.find('div.album').exists()).toBe(true)

      // カードクラス
      expect(wrapper.find('div.card').exists()).toBe(true)

      // 画像要素
      expect(cardDiv.find('img').attributes('src')).toBe('http://localhost:3000/electroless_nickel_plating.jpeg')

      // タイトル
      expect(cardDiv.find('div h5').text()).toBe('無電解ニッケルめっき')

      // 概要
      expect(cardDiv.find('div p').text()).toBe(
        '電気を使わず化学反応で金属表面にニッケルを析出する技術です。'
      )

      // リンク
      expect(cardDiv.findComponent('div a').text()).toBe('詳細へ')
      expect(cardDiv.findComponent('div a').props().to).toBe('/samples/1')
    })

    it('外部リンクが表示されること', () => {
      const div = wrapper.find('div[class="d-flex justify-content-evenly mt-5 mb-5"]')
      const routerLink = div.findComponent(RouterLinkStub)

      expect(routerLink.props().to).toBe('/home')
      expect(routerLink.text()).toBe('メインメニューへ')
    })
  })
    
  describe('初期レンダリングに失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 404
        }
      })

      wrapper = mount(SearchResultsListView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: 'サンプルの取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })
})
