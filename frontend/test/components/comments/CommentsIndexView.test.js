import CommentsIndexView from '@/components/comments/CommentsIndexView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const replaceMock = vi.fn()

vi.mock('axios')
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

describe('CommentsIndexView', () => {
  let wrapper

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      axios.get.mockResolvedValue({
        data: {
          comments: [
            {
              id: 1,
              commenter: '工藤 琴音',
              body: '製品に高級感を与える仕上がりで、見た目も美しいです。',
              sample_id: 16,
              updated_at: '2025-07-29T18:01:08.490Z',
              department: '品質管理部'
            },
            {
              id: 2,
              commenter: '岡田 茜',
              body: '表面の光沢感が上品で、高級感を感じさせます。',
              sample_id: 9,
              updated_at: '2025-07-29T18:01:08.491Z',
              department: '開発部'
            },
            {
              id: 3,
              commenter: '坂本 陽斗',
              body: '処理後の色の均一性が高く、ムラがありません。',
              sample_id: 10,
              updated_at: '2025-07-29T18:01:08.493Z',
              department: '製造部'
            },
            {
              id: 4,
              commenter: '池田 陽子',
              body: '耐久性が高く、長期間の使用に耐えられる仕上がりです。',
              sample_id: 1,
              updated_at: '2025-07-29T18:01:08.495Z',
              department: '営業部'
            },
            {
              id: 5,
              commenter: '原 悠人',
              body: '環境条件に強く、屋外でも変色がほとんどありません。',
              sample_id: 2,
              updated_at: '2025-07-29T18:01:08.496Z',
              department: '人事部'
            }
          ],
          current_page: 1,
          total_pages: 1
        }
      })

      wrapper = mount(CommentsIndexView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('コメントリスト')
    })

    it('コメントリストが表示されること', () => {
      // 部署名
      expect(wrapper.text()).toContain('品質管理部')
      expect(wrapper.text()).toContain('開発部')
      expect(wrapper.text()).toContain('製造部')
      expect(wrapper.text()).toContain('営業部')
      expect(wrapper.text()).toContain('人事部')

      // 投稿者
      expect(wrapper.text()).toContain('工藤 琴音')
      expect(wrapper.text()).toContain('岡田 茜')
      expect(wrapper.text()).toContain('坂本 陽斗')
      expect(wrapper.text()).toContain('池田 陽子')
      expect(wrapper.text()).toContain('原 悠人')

      // コメント
      expect(wrapper.text()).toContain(
        '製品に高級感を与える仕上がりで、見た目も美しいです。'
      )

      expect(wrapper.text()).toContain(
        '表面の光沢感が上品で、高級感を感じさせます。'
      )
      
      expect(wrapper.text()).toContain(
        '処理後の色の均一性が高く、ムラがありません。'
      )
      
      expect(wrapper.text()).toContain(
        '耐久性が高く、長期間の使用に耐えられる仕上がりです。'
      )
      
      expect(wrapper.text()).toContain(
        '環境条件に強く、屋外でも変色がほとんどありません。'
      )

      // 投稿日
      expect(wrapper.text().match(/\d{4}\/\d\/\d{2}/g).length).toBe(5)  // 2025/7/30 のような日付が対象
    })

    it('ページネーションが表示されること', () => {
      const liElement = wrapper.findAll('ul.pagination li')

      expect(liElement[0].text()).toBe('前ページ')
      expect(liElement[1].text()).toBe('1')
      expect(liElement[2].text()).toBe('次ページ')
    })

    it('外部リンクが表示されること', () => {
      const div = wrapper.find('div[class="d-flex justify-content-evenly mb-5"]')
      const routerLinks = div.findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLinks[0].props().to).toBe('/comments/new')
      expect(routerLinks[1].props().to).toBe('/home')

      // テキスト
      expect(routerLinks[0].text()).toBe('コメントの新規登録へ')
      expect(routerLinks[1].text()).toBe('メインメニューへ')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    beforeEach(async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 404
        }
      })

      wrapper = mount(CommentsIndexView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('404ページに遷移すること', () => {
      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: 'コメントリストの取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })
})