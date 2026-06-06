import CommentsEditView from '@/components/comments/CommentsEditView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'
import type { CommentResponse, Emit } from '@/composables/comments/useCommentsEdit.ts'
import type { VueWrapper } from '@vue/test-utils'

const { replaceMock, pushMock } = vi.hoisted(() => {
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
        push: pushMock,
      }
    }
  }
})

describe('CommentsEditView', (): void => {
  const mockCommentResponse: CommentResponse = {
    comment: {
      id: 1,
      commenter: '高木 優花',
      body: 'めっき処理が均一で、気泡や不純物がありません。',
      sample_id: 1,
      department: '営業部',
      user_id: 1,
    },
    maker_id: 1
  }

  const mountComponent = (): VueWrapper => mount(CommentsEditView, {
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
      it('コメント情報の編集ページが表示されること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: mockCommentResponse })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        // 見出し
        expect(wrapper.find('h3').text()).toBe('コメント情報の編集')

        // フォーム要素
        expect(wrapper.find('form').exists()).toBe(true)

        // ラベル要素
        expect(wrapper.find('label[for="commenter"]').text()).toBe('投稿者')
        expect(wrapper.find('label[for="department"]').text()).toBe('部署名')
        expect(wrapper.find('label[for="body"]').text()).toBe('コメント')

        // 入力要素
        expect((wrapper.find('#commenter').element as HTMLInputElement).value).toBe('高木 優花')
        expect((wrapper.find('#department').element as HTMLInputElement).value).toBe('営業部')

        // テキストエリア要素
        expect((wrapper.find('#body').element as HTMLInputElement).value).toBe(
          'めっき処理が均一で、気泡や不純物がありません。'
        )

        // ボタン要素
        const buttons = wrapper.findAll('button')
        expect(buttons[0].text()).toBe('更新')
        expect(buttons[1].text()).toBe('キャンセル')
      })
    })

    describe('失敗した場合', (): void => {
      it('404ページに遷移すること', async (): Promise<void> => {
        vi.mocked(axios.isAxiosError).mockReturnValue(true)

        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockRejectedValueOnce({ response: { status: 404 } })

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

  describe('コメント情報の更新', (): void => {
    describe('成功した場合', (): void => {
      it('コメント情報ページに遷移すること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: mockCommentResponse })

        vi.mocked(axios.patch).mockResolvedValueOnce({
          data: {
            id: 1,
            commenter: '高木 優花',
            body: '製品に高級感を与える仕上がりで、見た目も美しいです。',
            sample_id: 1,
            department: '営業部'
          }
        })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('#body').setValue('製品に高級感を与える仕上がりで、品質も良好です。')
        await wrapper.find('form').trigger('submit.prevent')

        const emittedMessage = wrapper.emitted<Emit>('message')
        expect(emittedMessage).toBeTruthy()
        expect(emittedMessage![0][0]).toEqual(
          { type: 'success', text: 'コメント情報を更新しました。' }
        )
        expect(pushMock).toHaveBeenCalledWith('/comments/1')
      })
    })

    describe('失敗した場合', (): void => {
      it('入力不備のメッセージが表示されること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: mockCommentResponse })

        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.patch).mockRejectedValue({ response: { status: 422 } })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('#body').setValue('')
        await wrapper.find('form').trigger('submit.prevent')

        expect(wrapper.find('.alert').text()).toBe('入力に不備があります。')
      })
    })
  })

  describe('コメント情報のキャンセル', (): void => {
    it('キャンセルボタンを押すとコメント情報ページに遷移すること', async (): Promise<void> => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ data: mockCommentResponse })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const cancelButton = wrapper.find('button[type="button"]')

      await cancelButton.trigger('click')

      expect(pushMock).toHaveBeenCalledWith('/comments/1')
    })
  })
})
