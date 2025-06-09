import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import MakersIndexView from '@/components/makers/MakersIndexView.vue'
import axios from 'axios'

vi.mock('axios')

const replaceMock = vi.fn()

vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        query: { page: '1' }
      }
    },
    useRouter: () => {
      return {
        replace: replaceMock
      }
    }
  }
})

describe('MakersIndexView', () => {
  describe('コンポーネントのレンダリング', () => {
    let wrapper

    beforeEach(async () => {
      axios.get.mockResolvedValue({ 
        data: { 
          makers: [
            { id: 1, name: '有限会社中野銀行' },
            { id: 2, name: '坂本建設有限会社' },
            { id: 3, name: '合同会社中村食品' },
            { id: 4, name: '合名会社武田印刷' },
            { id: 5, name: '中川食品有限会社' },
            { id: 6, name: '河野電気株式会社' },
            { id: 7, name: '小山食品合同会社' },
          ],
          current_page: 1,
          total_pages: 1
        }
      })

      wrapper = mount(MakersIndexView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出し「メーカーリスト」が表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('メーカーリスト')
    })
  
    it('ラベル「メーカー名 / 住所」と「電話番号 / FAX番号」が表示されること', () => {
      const labels = wrapper.findAll('h6')
  
      expect(labels[0].text()).toBe('メーカー名 / 住所')
      expect(labels[1].text()).toBe('電話番号 / FAX番号')
    })
  
    it('メーカーリストが7件表示されること', () => {
      const links = wrapper.findAll('a[class="list-group-item list-group-item-action"]')

      expect(links.length).toBe(7)
    })

    it('ページネーションの「前ページ」と「次ページ」のリンクが表示されること', () => {
      const spanElement = wrapper.findAll('span[class="page-link"]')

      expect(spanElement[0].text()).toBe('前ページ')
      expect(spanElement[1].text()).toBe('次ページ')
    })

    it('total_pagesが1に対しページネーションリンクの「1」が表示されること', () => {
      const aElement = wrapper.findAll('a[class="page-link"]')

      expect(aElement[0].text()).toBe('1')
    })

    it('外部リンクが表示されること', () => {
      expect(wrapper.findComponent({ ref: 'linkMakersNew' }).props().to).toBe('/makers/new')
      expect(wrapper.findComponent({ ref: 'linkMakersNew' }).text()).toBe('メーカー情報の登録')
      expect(wrapper.findComponent({ ref: 'linkHome' }).props().to).toBe('/home')
      expect(wrapper.findComponent({ ref: 'linkHome' }).text()).toBe('メインメニューへ')
    })
  })
  
  describe('API通信', () => {
    describe('メーカーリストの取得に成功した場合', () => {
      it('取得した分のメーカーリストが表示されること', async () => {
        axios.get.mockResolvedValue({
          data: {
            makers: [
              { id: 1, name: '有限会社中野銀行' },
              { id: 2, name: '坂本建設有限会社' },
              { id: 3, name: '合同会社中村食品' },
              { id: 4, name: '合名会社武田印刷' },
              { id: 5, name: '中川食品有限会社' },
              { id: 6, name: '河野電気株式会社' },
              { id: 7, name: '小山食品合同会社' },
            ]
          }
        })

        const wrapper = mount(MakersIndexView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.text()).toContain('有限会社中野銀行')
        expect(wrapper.text()).toContain('坂本建設有限会社')
        expect(wrapper.text()).toContain('合同会社中村食品')
        expect(wrapper.text()).toContain('合名会社武田印刷')
        expect(wrapper.text()).toContain('中川食品有限会社')
        expect(wrapper.text()).toContain('河野電気株式会社')
        expect(wrapper.text()).toContain('小山食品合同会社')
      })
    })

    describe('メーカーリストの取得に失敗した場合', () => {
      it('404ページに遷移すること', async () => {
        axios.get.mockRejectedValue({
          response: {
            status: 404
          }
        })

        const wrapper = mount(MakersIndexView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.emitted()).toHaveProperty('message')
        expect(wrapper.emitted().message[0]).toEqual([
          { type: 'danger', text: 'メーカーリストの取得に失敗しました。' }
        ])
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })  
})
