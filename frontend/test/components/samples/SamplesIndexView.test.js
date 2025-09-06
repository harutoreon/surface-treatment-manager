import SamplesIndexView from '@/components/samples/SamplesIndexView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const replaceMock = vi.fn()

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
        replace: replaceMock
      }
    }
  }
})

describe('SamplesIndexView', () => {
  let wrapper

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      axios.get.mockResolvedValue({
        data: {
          samples: [
            {
              id: 1,
              name: 'クロムめっき',
              category: 'めっき',
              color: 'シルバー',
              maker: '谷口情報株式会社',
            },
            {
              id: 2,
              name: '黒クロメート',
              category: '化成',
              color: 'ブラック',
              maker: '和田印刷合名会社',
            },
            {
              id: 3,
              name: '緑クロメート',
              category: '化成',
              color: 'オリーブ',
              maker: '合資会社岡本ガス',
            },
            {
              id: 4,
              name: '無電解ニッケルめっき',
              category: 'めっき',
              color: 'イエローブラウンシルバー',
              maker: '合同会社小林通信',
            },
            {
              id: 5,
              name: '黒色クロムめっき',
              category: 'めっき',
              color: 'マットブラック',
              maker: '合資会社青木ガス',
            },
            {
              id: 6,
              name: '白金めっき',
              category: 'めっき',
              color: 'シルバー',
              maker: '石井鉱業合資会社',
            },
            {
              id: 7,
              name: '金めっき',
              category: 'めっき',
              color: 'ゴールド',
              maker: '竹内電気株式会社',
            }
          ],
          current_page: 1,
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
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('表面処理リスト')
    })
    
    it('表面処理リストが表示されること', () => {
      // 処理名
      expect(wrapper.text()).toContain('クロムめっき')
      expect(wrapper.text()).toContain('黒クロメート')
      expect(wrapper.text()).toContain('緑クロメート')
      expect(wrapper.text()).toContain('無電解ニッケルめっき')
      expect(wrapper.text()).toContain('黒色クロムめっき')
      expect(wrapper.text()).toContain('白金めっき')
      expect(wrapper.text()).toContain('金めっき')
      
      // メーカー
      expect(wrapper.text()).toContain('谷口情報株式会社')
      expect(wrapper.text()).toContain('和田印刷合名会社')
      expect(wrapper.text()).toContain('合資会社岡本ガス')
      expect(wrapper.text()).toContain('合同会社小林通信')
      expect(wrapper.text()).toContain('合資会社青木ガス')
      expect(wrapper.text()).toContain('石井鉱業合資会社')
      expect(wrapper.text()).toContain('竹内電気株式会社')

      const links = wrapper.findAll('h6')

      // カテゴリー
      const plating = []
      
      for (const link of links) {
        if (link.text() === 'めっき') {
          plating.push(link.text())
        }
      }

      const conversion = []

      for (const link of links) {
        if (link.text() === '化成') {
          conversion.push(link.text())
        }
      }

      expect(plating.length).toBe(5)     // 「めっき」が5件表示されること
      expect(conversion.length).toBe(2)  // 「化成」が2件表示されること


      // 色調
      const silver = []
      
      for (const link of links) {
        if (link.text() === 'シルバー') {
          silver.push(link.text())
        }
      }

      expect(silver.length).toBe(2)  // シルバーが2件

      const black = []

      for (const link of links) {
        if (link.text() === 'ブラック') {
          black.push(link.text())
        }
      }

      expect(black.length).toBe(1)  // ブラックが1件

      expect(wrapper.text()).toContain('オリーブ')
      expect(wrapper.text()).toContain('マットブラック')
      expect(wrapper.text()).toContain('イエローブラウンシルバー')
      expect(wrapper.text()).toContain('ゴールド')
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
      expect(routerLinks[0].props().to).toBe('/samples/new')
      expect(routerLinks[1].props().to).toBe('/home')

      // テキスト
      expect(routerLinks[0].text()).toBe('表面処理情報の登録')
      expect(routerLinks[1].text()).toBe('メインメニューへ')
    })
  })
    
  describe('初期レンダリングに失敗した場合', () => {
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
