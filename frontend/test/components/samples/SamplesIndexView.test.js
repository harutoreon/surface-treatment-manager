import SamplesIndexView from '@/components/samples/SamplesIndexView.vue'
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

describe('SamplesIndexView', () => {
  let wrapper

  describe('ログインチェックに成功した場合', () => {
    it('表面処理リストページに移動すること', async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          status: 200
        })

      wrapper = mount(SamplesIndexView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('表面処理リスト')
    })
  })

  describe('ログインチェックに失敗した場合', () => {
    it('ログインページに移動すること', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 401
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
        { type: 'danger', text: 'ログインが必要です。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/')
      expect(pushMock).not.toHaveBeenCalledWith('/samples')
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
            samples: [
              {
                id: 1,
                name: 'クロムめっき',
                category: 'めっき',
                color: 'シルバー',
                feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
              },
              {
                id: 2,
                name: '黒クロメート',
                category: '化成',
                color: 'ブラック',
                feature: '耐蝕性・導電性・耐摩耗性・耐熱性',
              },
              {
                id: 3,
                name: '緑クロメート',
                category: '化成',
                color: 'オリーブ',
                feature: '耐食性・耐酸化性・電気抵抗性',
              },
              {
                id: 4,
                name: '無電解ニッケルめっき',
                category: 'めっき',
                color: 'イエローブラウンシルバー',
                feature: '耐摩耗性・潤滑性・耐食性・導電性',
              },
              {
                id: 5,
                name: '黒色クロムめっき',
                category: 'めっき',
                color: 'マットブラック',
                feature: '抗菌性・密着性',
              },
              {
                id: 6,
                name: '白金めっき',
                category: 'めっき',
                color: 'シルバー',
                feature: '耐食性・耐腐食性・密着性',
              },
              {
                id: 7,
                name: '金めっき',
                category: 'めっき',
                color: 'ゴールド',
                feature: '耐食性・潤滑性・摺動性',
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
      
      // 主な機能
      expect(wrapper.text()).toContain('耐食性・耐摩耗性・耐薬品性・耐熱性')
      expect(wrapper.text()).toContain('耐蝕性・導電性・耐摩耗性・耐熱性')
      expect(wrapper.text()).toContain('耐食性・耐酸化性・電気抵抗性')
      expect(wrapper.text()).toContain('耐摩耗性・潤滑性・耐食性・導電性')
      expect(wrapper.text()).toContain('抗菌性・密着性')
      expect(wrapper.text()).toContain('耐食性・耐腐食性・密着性')
      expect(wrapper.text()).toContain('耐食性・潤滑性・摺動性')

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


      // 色
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
      const ulElements = wrapper.findAll('ul')
      const routerLinks = ulElements[1].findAllComponents(RouterLinkStub)

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
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockRejectedValueOnce({
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
