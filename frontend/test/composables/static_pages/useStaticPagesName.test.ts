import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useStaticPagesName } from '@/composables/static_pages/useStaticPagesName'

const { pushMock } = vi.hoisted(() => {
  return {
    pushMock: vi.fn()
  }
})

vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock,
      }
    }
  }
})

describe('useStaticPagesName', (): void => {
  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期値の検証', (): void => {
    it('keyword の初期値が空文字であること', (): void => {
      const { keyword } = useStaticPagesName()
      expect(keyword.value).toBe('')
    })

    it('errorMessage の初期値が空文字であること', (): void => {
      const { errorMessage } = useStaticPagesName()
      expect(errorMessage.value).toBe('')
    })
  })

  describe('submitSearch', (): void => {
    describe('キーワードが入力された場合', (): void => {
      it('一度エラーが出た後、有効なキーワードで再送信するとエラーが解消される', (): void => {
        const { errorMessage, keyword, submitSearch } = useStaticPagesName()

        keyword.value = ''
        submitSearch()
        expect(errorMessage.value).toBe('キーワードが未入力です')

        keyword.value = 'めっき'
        submitSearch()
        expect(errorMessage.value).toBe('')
      })

      it('SearchResults ルートへ正しいパラメータで遷移する', (): void => {
        const { keyword, submitSearch } = useStaticPagesName()
        keyword.value = 'めっき'
        submitSearch()

        expect(pushMock).toHaveBeenCalledWith({
          name: 'SearchResults',
          params: { searchMethod: 'name'},
          query: { keyword: 'めっき' },
        })
      })

      it('キーワードの前後に空白があっても除去した値で遷移する', (): void => {
        const { keyword, submitSearch } = useStaticPagesName()
        keyword.value = ' めっき '
        submitSearch()

        expect(pushMock).toHaveBeenCalledWith({
          name: 'SearchResults',
          params: { searchMethod: 'name'},
          query: { keyword: 'めっき' },
        })
      })
    })

    describe('キーワードが空文字含めて未入力の場合', (): void => {
      it('未入力はエラーになる', (): void => {
        const { errorMessage, keyword, submitSearch } = useStaticPagesName()
        keyword.value = ''
        submitSearch()

        expect(errorMessage.value).toBe('キーワードが未入力です')
      })

      it('空文字はエラーになる', (): void => {
        const { errorMessage, keyword, submitSearch } = useStaticPagesName()
        keyword.value = '  '
        submitSearch()

        expect(errorMessage.value).toBe('キーワードが未入力です')
      })

      it('SearchResults ルートに遷移しない', (): void => {
        const { keyword, submitSearch } = useStaticPagesName()
        keyword.value = ''
        submitSearch()

        expect(pushMock).not.toHaveBeenCalled()
      })
    })
  })
})