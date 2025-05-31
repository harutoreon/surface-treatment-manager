import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import SamplesIndexView from '@/components/samples/SamplesIndexView.vue'
import axios from 'axios'

vi.mock('axios')

const replaceMock = vi.fn()

vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        query: { page: 1 }
      }
    },
    useRouter: () => {
      return {
        replace: replaceMock
      }
    }
  }
})

describe('SamplesIndexView', () => {
  let wrapper

  describe('DOMの構造', () => {
    beforeEach(() => {
      wrapper = mount(SamplesIndexView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })
    })

    it('見出しが存在すること', () => {
      expect(wrapper.find('h3').text()).toBe('表面処理リスト')
    })

    it('項目のラベルが存在すること', () => {
      expect(wrapper.find('#label_name_and_category').text()).toBe('処理名 / カテゴリー')
      expect(wrapper.find('#label_maker_name').text()).toBe('メーカー名')
    })
    
    it('ページネーションが存在すること', () => {
      expect(wrapper.find('#pagination').exists()).toBe(true)
      expect(wrapper.find('#pagination_previous_page').text()).toBe('前ページ')
      expect(wrapper.find('#pagination_next_page').text()).toBe('次ページ')

    })

    it('外部リンクが存在すること', () => {
      expect(wrapper.findComponent('#link_samples_new').text()).toBe('表面処理情報の登録')
      expect(wrapper.findComponent('#link_samples_new').props().to).toBe('/samples/new')

      expect(wrapper.findComponent('#link_home').text()).toBe('メインメニューへ')
      expect(wrapper.findComponent('#link_home').props().to).toBe('/home')
    })
  })

  describe('API通信', () => {
    describe('表面処理リストの取得に成功した場合', () => {
      it('表面処理リストが7件表示されること', async () => {
        axios.get.mockResolvedValue({
          data: {
            samples: [
              { "id": 1, "name": "無電解ニッケルめっき" },
              { "id": 2, "name": "白金めっき" },
              { "id": 3, "name": "金めっき" },
              { "id": 4, "name": "銀めっき" },
              { "id": 5, "name": "銅めっき" },
              { "id": 6, "name": "亜鉛めっき" },
              { "id": 7, "name": "錫めっき" },
            ],
            curent_page: 1,
            total_pages: 1
          }
        })

        wrapper = mount(SamplesIndexView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.html()).toContain('無電解ニッケルめっき')
        expect(wrapper.html()).toContain('白金めっき')
        expect(wrapper.html()).toContain('金めっき')
        expect(wrapper.html()).toContain('銀めっき')
        expect(wrapper.html()).toContain('銅めっき')
        expect(wrapper.html()).toContain('亜鉛めっき')
        expect(wrapper.html()).toContain('錫めっき')
      })
    })

    describe('表面処理リストの取得に失敗した場合', () => {
      it('404 ページに遷移すること', async () => {
        axios.get.mockRejectedValue({
          response: {
            status: 404
          }
        })

        wrapper = mount(SamplesIndexView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.emitted()).toHaveProperty('message')
        expect(wrapper.emitted().message[0]).toEqual([
          { type: 'danger', text: '表面処理リストの取得に失敗しました。' }])

        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })
})
