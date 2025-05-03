import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import SearchResultsNameView from '@/components/search_results/SearchResultsNameView.vue'
import axios from 'axios'

vi.mock('axios')

vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        query: { keyword: 'めっき' }
      }
    }
  }
})

describe('SearchResultsNameView', () => {
  describe('DOMの構造', () => {
    let wrapper

    axios.get.mockReturnValue({
      data: {
        keyword: 'めっき',
        samples: [
          { id: 1, name: 'ハードクロムめっき', maker: 'サンプルメーカー', category: 'めっき' },
        ]
      }
    })
    
    beforeEach(async () => {
      wrapper = mount(SearchResultsNameView)
      await flushPromises()
    })

    it('見出しが存在すること', () => {
      expect(wrapper.find('h3').exists()).toBe(true)
      expect(wrapper.find('h3').text()).toBe('表面処理の検索結果')
    })

    it('検索キーワードが存在すること', () => {
      expect(wrapper.find('h5').exists()).toBe(true)
      expect(wrapper.find('h5').text()).toContain('検索文字列：')
    })

    it('ラベルが存在すること', () => {
      expect(wrapper.find('#label_name_category').exists()).toBe(true)
      expect(wrapper.find('#label_name_category').text()).toBe('処理名 / カテゴリー')

      expect(wrapper.find('#label_maker').exists()).toBe(true)
      expect(wrapper.find('#label_maker').text()).toBe('メーカー名')
    })

    it('外部リンクが存在すること', () => {
      expect(wrapper.find('#research').exists()).toBe(true)
      expect(wrapper.find('#research').text()).toBe('再検索')
      expect(wrapper.find('#research').attributes('href')).toBe('#')
      
      expect(wrapper.find('#home').exists()).toBe(true)
      expect(wrapper.find('#home').text()).toBe('メインメニューへ')
      expect(wrapper.find('#home').attributes('href')).toBe('#')
    })
  })

  describe('API通信', () => {
    describe('レスポンスにサンプルが存在する場合', () => {
      it('取得したデータが画面に表示されること', async () => {
        axios.get.mockResolvedValue({
          data: {
            keyword: 'めっき',
            samples: [
              { id: 1, name: 'ハードクロムめっき', maker: 'メーカーA', category: 'めっき' },
              { id: 2, name: '無電解ニッケルめっき', maker: 'メーカーB', category: 'めっき' },
            ]
          }
        })

        const wrapper = mount(SearchResultsNameView)
        await flushPromises()

        expect(wrapper.find('h5').text()).toBe('検索文字列：「めっき」')
        expect(wrapper.text()).toContain('ハードクロムめっき')
        expect(wrapper.text()).toContain('メーカーA')
        expect(wrapper.text()).toContain('無電解ニッケルめっき')
        expect(wrapper.text()).toContain('メーカーB')
      })
    })
    
    describe('レスポンスにサンプルが存在しない場合', () => {
      it('「該当する表面処理はありませんんでした。」のメッセージが表示されること', async () => {
        axios.get.mockResolvedValue({
          data: {
            keyword: 'めっき',
            samples: []
          }
        })
  
        const wrapper = mount(SearchResultsNameView)
        await flushPromises()

        expect(wrapper.find('h4').text()).toBe('該当する表面処理はありませんでした。')
      })
    })
  })
})
