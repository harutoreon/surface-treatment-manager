import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import SearchResultsListView from '@/components/search_results/SearchResultsListView.vue'
import axios from 'axios'

vi.mock('axios')

describe('SearchResultsListView', () => {
  let wrapper

  describe('DOMの構造', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({
          data: [
            { "id": 1 }
          ]      
        })
  
        .mockResolvedValueOnce({
          data: {
            "id": 1,
            "name": "無電解ニッケルめっき",
            "image_url": "http://localhost:3000/electroless_nickel_plating.jpeg"
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

    it('見出しが存在すること', () => {
      expect(wrapper.find('h3').exists()).toBe(true)
      expect(wrapper.find('h3').text()).toBe('表面処理一覧')
    })

    it('アルバムが存在すること', () => {
      expect(wrapper.find('div[class="album"]').exists()).toBe(true)
    })

    it('カードが存在すること', () => {
      expect(wrapper.find('div[class="card"]').exists()).toBe(true)
      expect(wrapper.find('img').exists()).toBe(true)
      expect(wrapper.find('div[class="card-body"]').exists()).toBe(true)
      expect(wrapper.find('h5').attributes('class')).toContain('card-title')
      expect(wrapper.find('p[class="card-text"]').exists()).toBe(true)
      expect(wrapper.findComponent({ ref: 'linkSample1' }).text()).toBe('詳細へ')
      expect(wrapper.findComponent({ ref: 'linkSample1' }).props().to).toBe('/samples/1')
    })

    it('外部リンクが存在すること', () => {
      expect(wrapper.findComponent({ ref: 'linkHome' }).exists()).toBe(true)
      expect(wrapper.findComponent({ ref: 'linkHome' }).text()).toBe('メインメニューへ')
      expect(wrapper.findComponent({ ref: 'linkHome' }).props().to).toBe('/home')
    })
  })

  describe('API通信', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({
          data: [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 }
          ]
        })

        .mockResolvedValueOnce({
          data: {
            "id": 1,
            "name": "無電解ニッケルめっき",
            "image_url": "http://localhost:3000/electroless_nickel_plating.jpeg"
          }
        })

        .mockResolvedValueOnce({
          data: {
            "id": 2,
            "name": "白金めっき",
            "image_url": "http://localhost:3000/white_silver_plating.jpeg"
          }
        })

        .mockResolvedValueOnce({
          data: {
            "id": 3,
            "name": "金めっき",
            "image_url": "http://localhost:3000/gold_plate.jpeg"
          }
        })

        .mockResolvedValueOnce({
          data: {
            "id": 4,
            "name": "銀めっき",
            "image_url": "http://localhost:3000/silver_plating.jpeg"
          }
        })

        .mockResolvedValueOnce({
          data: {
            "id": 5,
            "name": "銅めっき",
            "image_url": "http://localhost:3000/copper_plating.jpeg"
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

    it('取得したデータの件数分だけサンプルのリンクが表示されること', () => {
      expect(wrapper.findComponent({ ref: 'linkSample1' }).props().to).toBe('/samples/1')
      expect(wrapper.findComponent({ ref: 'linkSample2' }).props().to).toBe('/samples/2')
      expect(wrapper.findComponent({ ref: 'linkSample3' }).props().to).toBe('/samples/3')
      expect(wrapper.findComponent({ ref: 'linkSample4' }).props().to).toBe('/samples/4')
      expect(wrapper.findComponent({ ref: 'linkSample5' }).props().to).toBe('/samples/5')
    })
  })
})
