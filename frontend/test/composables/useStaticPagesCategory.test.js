import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useStaticPagesCategory } from '@/composables/useStaticPagesCategory.js'
import axios from 'axios'
import { useRouter } from 'vue-router'

vi.mock('axios')
vi.mock('vue-router')

describe('useStaticPagesCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('初期状態の検証', () => {
    it('options の初期値が空の配列であること', () => {
      const { options } = useStaticPagesCategory()
      expect(options.value).toEqual([])
    })

    it('keyword の初期値が空文字であること', () => {
      const { keyword } = useStaticPagesCategory()
      expect(keyword.value).toBe('')
    })

    it('errorMessage の初期値が空文字であること', () => {
      const { errorMessage } = useStaticPagesCategory()
      expect(errorMessage.value).toBe('')
    })
  })

  describe('ロジックの検証', () => {
    describe('fetchCategories', () => {
      describe('API リクエストに成功した場合', () => {
        it('カテゴリー一覧が取得されること', async () => {
          vi.mocked(axios).get.mockResolvedValue({
            data: [
              { id: 1, item: 'めっき' }
            ]
          })

          const { options, fetchCategories } = useStaticPagesCategory()
          await fetchCategories()

          expect(options.value).toEqual([ { id: 1, item: 'めっき' } ])
        })
      })

      describe('API リクエストに失敗した場合', () => {
        it('message イベントが発火し、NotFound ルートへ遷移すること', async () => {
          const emitMock = vi.fn()
          const replaceMock = vi.fn()

          vi.mocked(axios).get.mockRejectedValue({ response: { status: 404 } })
          vi.mocked(useRouter).mockReturnValue({ replace: replaceMock })

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

    describe('submitSearch', () => {
      describe('有効なキーワードで送信した場合', () => {
        it('SearchResults ルートへ正しいパラメータで遷移すること', () => {
          const pushMock = vi.fn()
          vi.mocked(useRouter).mockReturnValue({ push: pushMock })

          const { keyword, submitSearch } = useStaticPagesCategory()
          keyword.value = 'めっき'
          submitSearch()

          expect(pushMock).toHaveBeenCalledWith({
            name: 'SearchResults',
            params: { searchMethod: 'category'},
            query: { keyword: 'めっき'}
          })
        })

        it('エラーメッセージがリセットされること', () => {
          const { errorMessage, keyword, submitSearch } = useStaticPagesCategory()
          errorMessage.value = 'リスト内の項目を選択して下さい'
          keyword.value = 'めっき'
          submitSearch()

          expect(errorMessage.value).toBe('')
        })
      })

      describe('無効なキーワードで送信した場合', () => {
        it('エラーになること', async () => {
          const { errorMessage, keyword, submitSearch } = useStaticPagesCategory()
          keyword.value = ''
          submitSearch()

          expect(errorMessage.value).toBe('リスト内の項目を選択して下さい')
        })
      })
    })
  })
})
