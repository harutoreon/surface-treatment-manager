import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useStaticPagesCategory } from '@/composables/static_pages/useStaticPagesCategory'
import axios from 'axios'
import type { MessageEmit } from '@/env'

const { replaceMock, pushMock } = vi.hoisted(() => {
  return {
    replaceMock: vi.fn(),
    pushMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        replace: replaceMock,
        push: pushMock,
      }
    }
  }
})

describe('useStaticPagesCategory', (): void => {
  const emitMock: MessageEmit = vi.fn()

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期状態の検証', (): void => {
    it('options の初期値が空の配列であること', (): void => {
      const { options } = useStaticPagesCategory(emitMock)
      expect(options.value).toEqual([])
    })

    it('keyword の初期値が空文字であること', (): void => {
      const { keyword } = useStaticPagesCategory(emitMock)
      expect(keyword.value).toBe('')
    })

    it('errorMessage の初期値が空文字であること', (): void => {
      const { errorMessage } = useStaticPagesCategory(emitMock)
      expect(errorMessage.value).toBe('')
    })
  })

  describe('ロジックの検証', (): void => {
    describe('fetchCategories', (): void => {
      describe('API リクエストに成功した場合', (): void => {
        it('カテゴリー一覧が取得されること', async (): Promise<void> => {
          vi.mocked(axios).get.mockResolvedValue({ data: [ { id: 1, item: 'めっき' } ]})

          const { options, fetchCategories } = useStaticPagesCategory(emitMock)
          await fetchCategories()

          expect(options.value).toEqual([ { id: 1, item: 'めっき' } ])
        })
      })

      describe('API リクエストに失敗した場合', (): void => {
        it('message イベントが発火し、NotFound ルートへ遷移すること', async (): Promise<void> => {
          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios).get.mockRejectedValue({ response: { status: 404 } })

          const { fetchCategories } = useStaticPagesCategory(emitMock)
          await fetchCategories()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: 'カテゴリーの取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })

    describe('submitSearch', (): void => {
      describe('有効なキーワードで送信した場合', (): void => {
        it('SearchResults ルートへ正しいパラメータで遷移すること', (): void => {
          const { keyword, submitSearch } = useStaticPagesCategory(emitMock)
          keyword.value = 'めっき'
          submitSearch()

          expect(pushMock).toHaveBeenCalledWith({
            name: 'SearchResults',
            params: { searchMethod: 'category'},
            query: { keyword: 'めっき'}
          })
        })

        it('エラーメッセージがリセットされること', (): void => {
          const { errorMessage, keyword, submitSearch } = useStaticPagesCategory(emitMock)
          errorMessage.value = 'リスト内の項目を選択して下さい'
          keyword.value = 'めっき'
          submitSearch()

          expect(errorMessage.value).toBe('')
        })
      })

      describe('無効なキーワードで送信した場合', (): void => {
        it('エラーになること', async (): Promise<void> => {
          const { errorMessage, keyword, submitSearch } = useStaticPagesCategory(emitMock)
          keyword.value = ''
          submitSearch()

          expect(errorMessage.value).toBe('リスト内の項目を選択して下さい')
        })
      })
    })
  })
})