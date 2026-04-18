import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useStaticPagesName } from '@/composables/useStaticPagesName.js'
import { useRouter } from 'vue-router'

vi.mock('vue-router')

describe('useStaticPagesName', () => {
  describe('初期状態の検証', () => {
    it('keyword の初期値が空文字であること', () => {
      const { keyword } = useStaticPagesName()
      expect(keyword.value).toBe('')
    })

    it('errorMessage の初期値が空文字であること', () => {
      const { errorMessage } = useStaticPagesName()
      expect(errorMessage.value).toBe('')
    })
  })

  describe('ビジネスロジックの実行検証', () => {
    describe('キーワードが未入力の場合', () => {
      it('エラーになること', () => {
        const { errorMessage, keyword, submitSearch } = useStaticPagesName()
        keyword.value = ''
        submitSearch()

        expect(errorMessage.value).toBe('キーワードが未入力です')
      })
    })

    describe('キーワードが空文字の場合', () => {
      it('エラーになること', () => {
        const { errorMessage, keyword, submitSearch } = useStaticPagesName()
        keyword.value = '  '
        submitSearch()

        expect(errorMessage.value).toBe('キーワードが未入力です')
      })
    })

    describe('キーワードが入力された場合', () => {
      const pushMock = vi.fn()

      beforeEach(() => {
        pushMock.mockClear()
        vi.mocked(useRouter).mockReturnValue({ push: pushMock })
      })

      it('エラーメッセージがリセットされること', () => {
        const { errorMessage, keyword, submitSearch } = useStaticPagesName()

        keyword.value = ''
        submitSearch()
        expect(errorMessage.value).toBe('キーワードが未入力です')

        keyword.value = 'めっき'
        submitSearch()
        expect(errorMessage.value).toBe('')
      })

      it('SearchResults ルートへ正しいパラメータで遷移すること', () => {
        const { keyword, submitSearch } = useStaticPagesName()
        keyword.value = 'めっき'
        submitSearch()

        expect(pushMock).toHaveBeenCalledWith({
          name: 'SearchResults',
          params: { searchMethod: 'name'},
          query: { keyword: 'めっき' },
        })
      })
    })
  })
})