import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import SamplesIndexView from '@/components/samples/SamplesIndexView.vue'
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

describe('SamplesIndexView', () => {
  let wrapper

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        samples: [
          {
            "id": 1,
            "name": "無電解ニッケルめっき",
            "category": "めっき",
            "color": "イエローブラウンシルバー",
            "maker": "小島印刷合同会社",
            "created_at": "2025-02-23T22:15:29.815Z",
            "updated_at": "2025-02-23T22:15:29.815Z",
            "picture": "#<File:0x0000ffff859a8be0>",
            "hardness": "析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度",
            "film_thickness": "通常は3～5μm、厚めの場合は20～50μmまで可能",
            "feature": "耐食性・耐摩耗性・耐薬品性・耐熱性"
          },
          {
            "id": 2,
            "name": "白金めっき",
            "category": "めっき",
            "color": "シルバー",
            "maker": "小山印刷合資会社",
            "created_at": "2025-02-23T22:15:29.817Z",
            "updated_at": "2025-02-23T22:15:29.817Z",
            "picture": "#<File:0x0000ffff85969828>",
            "hardness": "Hv300～Hv400程度",
            "film_thickness": "水素水生成器用の白金電極では0.5～2.0μm、装飾品では0.1～0.5μm程度",
            "feature": "耐蝕性・導電性・耐摩耗性・耐熱性"
          },
          {
            "id": 3,
            "name": "金めっき",
            "category": "めっき",
            "color": "ゴールド",
            "maker": "合名会社木下銀行",
            "created_at": "2025-02-23T22:15:29.818Z",
            "updated_at": "2025-02-23T22:15:29.818Z",
            "picture": "#<File:0x0000ffff85a1ab00>",
            "hardness": "HV60～80程度",
            "film_thickness": "下地ニッケルめっきは3～5μm、金めっきは0.1～1.0μm",
            "feature": "耐食性・耐酸化性・電気抵抗性"
          },
          {
            "id": 4,
            "name": "銀めっき",
            "category": "めっき",
            "color": "シルバー",
            "maker": "杉山食品有限会社",
            "created_at": "2025-02-23T22:15:29.819Z",
            "updated_at": "2025-02-23T22:15:29.819Z",
            "picture": "#<File:0x0000ffff85aebde0>",
            "hardness": "HV60～80程度",
            "film_thickness": "0.1～3μm程度",
            "feature": "耐摩耗性・潤滑性・耐食性・導電性"
          },
          {
            "id": 5,
            "name": "銅めっき",
            "category": "めっき",
            "color": "ブロンズ",
            "maker": "金子保険合資会社",
            "created_at": "2025-02-23T22:15:29.821Z",
            "updated_at": "2025-02-23T22:15:29.821Z",
            "picture": "#<File:0x0000ffff85b8cd30>",
            "hardness": "無光沢でHv80～120、光沢でHv80～200程度",
            "film_thickness": "0.2～2μm程度",
            "feature": "抗菌性・密着性"
          },
          {
            "id": 6,
            "name": "亜鉛めっき",
            "category": "めっき",
            "color": "シルバー",
            "maker": "中島水産合名会社",
            "created_at": "2025-02-23T22:15:29.822Z",
            "updated_at": "2025-02-23T22:15:29.822Z",
            "picture": "#<File:0x0000ffff85c3da40>",
            "hardness": "シアン浴でHv60～90、ジンケート浴でHv100～140、塩化浴でHv60～90",
            "film_thickness": "5～20μm程度",
            "feature": "耐食性・耐腐食性・密着性"
          },
          {
            "id": 7,
            "name": "錫めっき",
            "category": "めっき",
            "color": "ホワイトシルバー",
            "maker": "合名会社今井情報",
            "created_at": "2025-02-23T22:15:29.824Z",
            "updated_at": "2025-02-23T22:15:29.824Z",
            "picture": "#<File:0x0000ffff85cdea58>",
            "hardness": "Hv9.5～10.5程度",
            "film_thickness": "光沢スズめっきで3～10μm、無光沢スズめっきで5～20μm程度",
            "feature": "耐食性・潤滑性・摺動性"
          },
          {
            "id": 8,
            "name": "ニッケルめっき",
            "category": "めっき",
            "color": "ライトシルバー",
            "maker": "合資会社村田ガス",
            "created_at": "2025-02-23T22:15:29.825Z",
            "updated_at": "2025-02-23T22:15:29.825Z",
            "picture": "#<File:0x0000ffff85d4fd20>",
            "hardness": "Hv350 ～500程度",
            "film_thickness": "3～30μm程度",
            "feature": "耐食性・耐薬品性・耐熱性"
          },
        ],
        curent_page: 1,
        total_pages: 1
      }
    }),
    wrapper = mount(SamplesIndexView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })  
  })

  describe('DOMの構造', () => {
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
      expect(wrapper.find('a[href="/samples/new"]').text()).toBe('表面処理情報の登録')
      expect(wrapper.find('a[href="/home"]').text()).toBe('メインメニューへ')
    })
  })

  describe('API通信', () => {
    it('表面処理リストが8件表示されること', () => {
      expect(wrapper.html()).toContain('無電解ニッケルめっき')
      expect(wrapper.html()).toContain('白金めっき')
      expect(wrapper.html()).toContain('金めっき')
      expect(wrapper.html()).toContain('銀めっき')
      expect(wrapper.html()).toContain('銅めっき')
      expect(wrapper.html()).toContain('亜鉛めっき')
      expect(wrapper.html()).toContain('錫めっき')
      expect(wrapper.html()).toContain('ニッケルめっき')
    })
  })
})
