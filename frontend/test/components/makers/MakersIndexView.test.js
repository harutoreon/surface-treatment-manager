import MakersIndexView from '@/components/makers/MakersIndexView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const replaceMock = vi.fn()
const pushMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        query: { page: '1' }
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

describe('MakersIndexView', () => {
  let wrapper

  describe('ログインチェックに成功した場合', () => {
    it('メーカーリストページに移動すること', async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          status: 200
        })

      wrapper = mount(MakersIndexView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('メーカーリスト')
    })
  })

  describe('ログインチェックに失敗した場合', () => {
    it('ログインページに移動すること', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 401
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

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: 'ログインが必要です。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/')
      expect(pushMock).not.toHaveBeenCalledWith('/makers')
    })
  })

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            makers: [
              {
                id: 1,
                name: '有限会社中野銀行',
                address: '東京都渋谷区神南1-2-0',
                phone_number: '080-6915-6256',
                fax_number: '野口水産合同会社'
              },
              {
                id: 2,
                name: '坂本建設有限会社',
                address: '東京都渋谷区神南1-2-1',
                phone_number: '090-5016-7802',
                fax_number: '合同会社中村通信'
              },
              {
                id: 3,
                name: '合同会社中村食品',
                address: '東京都渋谷区神南1-2-2',
                phone_number: '090-9222-9805',
                fax_number: '大野ガス合同会社'
              },
              {
                id: 4,
                name: '合名会社武田印刷',
                address: '東京都渋谷区神南1-2-3',
                phone_number: '090-9645-7735',
                fax_number: '合名会社藤原銀行'
              },
              {
                id: 5,
                name: '中川食品有限会社',
                address: '東京都渋谷区神南1-2-4',
                phone_number: '080-8741-1506',
                fax_number: '株式会社藤井運輸'
              },
              {
                id: 6,
                name: '河野電気株式会社',
                address: '東京都渋谷区神南1-2-5',
                phone_number: '090-4084-5101',
                fax_number: '有限会社岡本印刷'
              },
              {
                id: 7,
                name: '小山食品合同会社',
                address: '東京都渋谷区神南1-2-6',
                phone_number: '090-6889-8398',
                fax_number: '木下建設有限会社'
              },
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

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('メーカーリスト')
    })
    
    it('メーカーリストが表示されること', () => {
      // メーカー名
      expect(wrapper.text()).toContain('有限会社中野銀行')
      expect(wrapper.text()).toContain('坂本建設有限会社')
      expect(wrapper.text()).toContain('合同会社中村食品')
      expect(wrapper.text()).toContain('合名会社武田印刷')
      expect(wrapper.text()).toContain('中川食品有限会社')
      expect(wrapper.text()).toContain('河野電気株式会社')
      expect(wrapper.text()).toContain('小山食品合同会社')

      // 住所
      expect(wrapper.text()).toContain('東京都渋谷区神南1-2-0')
      expect(wrapper.text()).toContain('東京都渋谷区神南1-2-1')
      expect(wrapper.text()).toContain('東京都渋谷区神南1-2-2')
      expect(wrapper.text()).toContain('東京都渋谷区神南1-2-3')
      expect(wrapper.text()).toContain('東京都渋谷区神南1-2-4')
      expect(wrapper.text()).toContain('東京都渋谷区神南1-2-5')
      expect(wrapper.text()).toContain('東京都渋谷区神南1-2-6')

      // 電話番号
      expect(wrapper.text()).toContain('080-6915-6256')
      expect(wrapper.text()).toContain('090-5016-7802')
      expect(wrapper.text()).toContain('090-9222-9805')
      expect(wrapper.text()).toContain('090-9645-7735')
      expect(wrapper.text()).toContain('080-8741-1506')
      expect(wrapper.text()).toContain('090-4084-5101')
      expect(wrapper.text()).toContain('090-6889-8398')

      // FAX番号
      expect(wrapper.text()).toContain('野口水産合同会社')
      expect(wrapper.text()).toContain('合同会社中村通信')
      expect(wrapper.text()).toContain('大野ガス合同会社')
      expect(wrapper.text()).toContain('合名会社藤原銀行')
      expect(wrapper.text()).toContain('株式会社藤井運輸')
      expect(wrapper.text()).toContain('有限会社岡本印刷')
      expect(wrapper.text()).toContain('木下建設有限会社')
    })

    it('ページネーションが表示されること', () => {
      expect(wrapper.text()).toContain('前ページ')
      expect(wrapper.text()).toContain('次ページ')
      expect(wrapper.find('a[class="page-link"]').text()).toBe('1')
    })

    it('外部リンクが表示されること', () => {
      const div = wrapper.find('div[class="d-flex justify-content-evenly"]')
      const routerLinks = div.findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLinks[0].props().to).toBe('/makers/new')
      expect(routerLinks[1].props().to).toBe('/home')

      // テキスト
      expect(routerLinks[0].text()).toBe('メーカー情報の登録')
      expect(routerLinks[1].text()).toBe('メインメニューへ')
    })
  })
  
  describe('初期レンダリングに失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockRejectedValueOnce({
          response: {
            status: 404
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

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: 'メーカーリストの取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  }) 
})
