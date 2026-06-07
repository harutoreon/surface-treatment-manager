import CommentsShowView from '@/components/comments/CommentsShowView.vue'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import type { CommentsResponse, Emit } from '@/composables/comments/useCommentsShow.ts'
import axios from 'axios'

const { replaceMock, pushMock} = vi.hoisted(() => {
  return {
    replaceMock: vi.fn(),
    pushMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        params: { id: '1' }
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

describe('CommentsShowView', (): void => {
  const adminUserId: number = 49

  const mountComponent = (): VueWrapper => mount(CommentsShowView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  const mockResponse: CommentsResponse = {
    comment: {
      id: 1,
      body: '製品に高級感を与える仕上がりで、見た目も美しいです。',
      commenter: '工藤 琴音',
      department: '品質管理部',
      sample_id: 16,
      user_id: 34
    },
    maker_id: 1
  }

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期レンダリング', (): void => {
    describe('成功した場合', (): void => {
      it('コメント情報ページが表示されること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: { payload: { user_id: adminUserId } } })
          .mockResolvedValueOnce({ data: mockResponse })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        // 見出し
        expect(wrapper.find('h3').text()).toBe('コメント情報')

        // コメント
        const ulElement = wrapper.find('ul')
        expect(ulElement.text()).toContain('部署名')
        expect(ulElement.text()).toContain('品質管理部')
        expect(ulElement.text()).toContain('投稿者')
        expect(ulElement.text()).toContain('工藤 琴音')
        expect(ulElement.text()).toContain('コメント')
        expect(ulElement.text()).toContain('製品に高級感を与える仕上がりで、見た目も美しいです。')

        // ナビゲーションリンク
        const routerLinks = wrapper.findAllComponents(RouterLinkStub)
        expect(routerLinks[0].props().to).toBe('/comments/1/edit')
        expect(routerLinks[1].props().to).toBe('/comments')
        expect(routerLinks[2].props().to).toBe('/samples/16')
        expect(routerLinks[0].text()).toBe('コメント情報の編集')
        expect(routerLinks[1].text()).toBe('コメントリストへ')
        expect(routerLinks[2].text()).toBe('表面処理情報へ')

        // コメント削除ボタン
        const deleteButton = wrapper.find('button')
        expect(deleteButton.exists()).toBe(true)
      })
    })

    describe('失敗した場合', (): void => {
      it('404ページに遷移すること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: { payload: { user_id: adminUserId } } })
          .mockRejectedValueOnce({ response: { status: 404 } })

        vi.mocked(axios.isAxiosError).mockReturnValue(true)

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        const emittedMessage = wrapper.emitted<Emit>('message')
        expect(emittedMessage).toBeTruthy()
        expect(emittedMessage![0][0]).toEqual(
          { type: 'danger', text: 'コメント情報の取得に失敗しました。' }
        )
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })

  describe('コメントの削除', (): void => {
    afterEach((): void => {
      vi.unstubAllGlobals()
    })

    describe('確認ダイアログで「はい」を押した場合', (): void => {
      it('削除処理が実行されること', async (): Promise<void> => {
        vi.stubGlobal('confirm', vi.fn((): boolean => true))

        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: { payload: { user_id: adminUserId } } })
          .mockResolvedValueOnce({ data: mockResponse })

        vi.mocked(axios.delete).mockResolvedValueOnce({ data: { status: 204 } })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('button').trigger('click')
        await flushPromises()

        const emittedMessage = wrapper.emitted<Emit>('message')
        expect(emittedMessage).toBeTruthy()
        expect(emittedMessage![0][0]).toEqual(
          { type: 'success', text: 'コメント情報を1件削除しました。' }
        )
        expect(pushMock).toHaveBeenCalledWith('/comments')
      })
    })

    describe('確認ダイアログで「キャンセル」を押した場合', (): void => {
      it('削除処理がキャンセルされること', async (): Promise<void> => {
        vi.stubGlobal('confirm', vi.fn((): boolean => false))

        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: { payload: { user_id: adminUserId } } })
          .mockResolvedValueOnce({ data: mockResponse })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('button').trigger('click')

        expect(pushMock).not.toHaveBeenCalledWith('/comments')
      })
    })

    describe('削除処理が失敗した場合', (): void => {
      it('エラーメッセージが表示され、NotFound ルートに遷移すること', async (): Promise<void> => {
        vi.stubGlobal('confirm', vi.fn((): boolean => true))

        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: { payload: { user_id: adminUserId } } })
          .mockResolvedValueOnce({ data: mockResponse })

        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.delete).mockRejectedValueOnce({ response: { status: 404 } })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('button').trigger('click')
        await flushPromises()

        const emittedMessage = wrapper.emitted<Emit>('message')
        expect(emittedMessage).toBeTruthy()
        expect(emittedMessage![0][0]).toEqual(
          { type: 'danger', text: '削除処理に失敗しました。' }
        )
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })

  describe('ログインユーザー毎のレンダリング', (): void => {
    describe('一般ユーザーでログインした場合', (): void => {
      it('コメントリストリンクとコメント情報の削除リンクは表示されないこと', async (): Promise<void> => {
        const generalUserId: number = 50

        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: { payload: { user_id: generalUserId } } })
          .mockResolvedValueOnce({ data: mockResponse })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        const routerLinks = wrapper.findAllComponents(RouterLinkStub)
        expect(routerLinks[1].attributes('style')).toBe('display: none;')

        const deleteButton = wrapper.find('button')
        expect(deleteButton.attributes('style')).toBe('display: none;')
      })
    })
  })
})
