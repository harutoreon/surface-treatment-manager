import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import MakersIndexView from '@/components/makers/MakersIndexView.vue'
import axios from 'axios'

vi.mock('axios')

vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        query: { page: '1' }
      }
    }
  }
})

describe('MakersIndexView', () => {
  let wrapper

  beforeEach(() => {
    axios.get.mockResolvedValue({ 
      data: { 
        makers: [
          {
            "id": 1,
            "name": "有限会社中野銀行",
            "postal_code": "962-0713",
            "address": "東京都渋谷区神南1-2-0",
            "phone_number": "070-3288-2552",
            "fax_number": "070-2623-8399",
          },
          {
            "id": 2,
            "name": "坂本建設有限会社",
            "postal_code": "652-0812",
            "address": "東京都渋谷区神南1-2-1",
            "phone_number": "070-2977-0116",
            "fax_number": "090-2701-9505",
          },
          {
            "id": 3,
            "name": "合同会社中村食品",
            "postal_code": "950-2073",
            "address": "東京都渋谷区神南1-2-2",
            "phone_number": "080-3109-7360",
            "fax_number": "070-2929-9663",
          },
          {
            "id": 4,
            "name": "合名会社武田印刷",
            "postal_code": "007-0870",
            "address": "東京都渋谷区神南1-2-3",
            "phone_number": "080-7349-8615",
            "fax_number": "080-3489-8988",
          },
          {
            "id": 5,
            "name": "中川食品有限会社",
            "postal_code": "990-0810",
            "address": "東京都渋谷区神南1-2-4",
            "phone_number": "080-7508-7472",
            "fax_number": "080-8725-9443",
          },
          {
            "id": 6,
            "name": "河野電気株式会社",
            "postal_code": "780-0932",
            "address": "東京都渋谷区神南1-2-5",
            "phone_number": "070-6431-8311",
            "fax_number": "080-1287-6419",
          },
          {
            "id": 7,
            "name": "小山食品合同会社",
            "postal_code": "649-2602",
            "address": "東京都渋谷区神南1-2-6",
            "phone_number": "090-6097-5063",
            "fax_number": "090-2418-6666",
          },
        ],
        current_page: 1,
        total_pages: 1
      }
    }),
    wrapper = mount(MakersIndexView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })
  })

  describe('コンポーネントのレンダリング', () => {
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

    it('外部リンク「メーカー情報の登録」と「メインメニュー」が表示されること', () => {
      const links = wrapper.findAllComponents(RouterLinkStub)

      expect(links[8].text()).toBe('メーカー情報の登録')
      expect(links[9].text()).toBe('メインメニューへ')
    })

    it('外部リンクのto属性に「#」と「/home」が設定されていること', () => {
      const links = wrapper.findAllComponents(RouterLinkStub)

      expect(links[8].props().to).toBe('/makers/new')
      expect(links[9].props().to).toBe('/home')
    })
  })  
})
