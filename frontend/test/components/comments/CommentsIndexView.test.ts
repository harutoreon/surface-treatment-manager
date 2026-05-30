import CommentsIndexView from '@/components/comments/CommentsIndexView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import type { CommentsResponse, Emit } from '@/composables/comments/useCommentsIndex.ts'
import axios from 'axios'

const { replaceMock } = vi.hoisted(() => {
  return {
    replaceMock: vi.fn()
  }
})

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
        replace: replaceMock,
      }
    }
  }
})

describe('CommentsIndexView', (): void => {
  const mockResponse: CommentsResponse = {
    comments: [
      {
        id: 1,
        body: '製品に高級感を与える仕上がりで、見た目も美しいです。',
        commenter: '工藤 琴音',
        department: '品質管理部',
        sample_id: 16,
        user_id: 1,
        updated_at: '2025-07-29T18:01:08.490Z',
      },
    ],
    current_page: 1,
    total_pages: 1
  }

  const mountComponent = (): VueWrapper => mount(CommentsIndexView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期レンダリング', (): void => {
    describe('成功した場合', (): void => {
      it('コメントリストページが表示されること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })  // checkLoginStatus()
          .mockResolvedValueOnce({ data: mockResponse })  // fetchCommentList()

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        // 見出し
        expect(wrapper.find('h3').text()).toBe('コメントリスト')

        // 部署名
        expect(wrapper.text()).toContain('品質管理部')

        // 投稿者
        expect(wrapper.text()).toContain('工藤 琴音')

        // コメント
        expect(wrapper.text()).toContain(
          '製品に高級感を与える仕上がりで、見た目も美しいです。'
        )

        // 投稿日
        expect(wrapper.text().match(/\d{4}\/\d\/\d{2}/g).length).toBe(1)  // 2025/7/30 のような日付が対象

        // ページネーション
        const liElement = wrapper.findAll('ul.pagination li')
        expect(liElement[0].text()).toBe('前ページ')
        expect(liElement[1].text()).toBe('1')
        expect(liElement[2].text()).toBe('次ページ')

        // ナビゲーションリンク
        const ulElements = wrapper.findAll('ul')
        const routerLinks = ulElements[1].findAllComponents(RouterLinkStub)
        expect(routerLinks[0].props().to).toBe('/comments/new')
        expect(routerLinks[1].props().to).toBe('/home')
        expect(routerLinks[0].text()).toBe('コメントの新規登録へ')
        expect(routerLinks[1].text()).toBe('メインメニューへ')
      })
    })

    describe('失敗した場合', (): void => {
      it('404ページに遷移すること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })  // checkLoginStatus()
          .mockRejectedValueOnce({ response: { status: 404 } })  // fetchCommentList()

        vi.mocked(axios.isAxiosError).mockReturnValue(true)

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        const emittedMessage = wrapper.emitted('message') as Emit[] | undefined
        expect(emittedMessage).toBeTruthy()
        expect(emittedMessage![0][0]).toEqual(
          { type: 'danger', text: 'コメントリストの取得に失敗しました。' }
        )
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })
})
