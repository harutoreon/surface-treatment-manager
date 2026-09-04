import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useStaticPagesMaker } from '@/composables/static_pages/useStaticPagesMaker'
import axios from 'axios'

const { pushMock } = vi.hoisted(() => {
  return {
    pushMock: vi.fn()
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock,
      }
    }
  }
})

describe('useStaticPagesMaker', (): void => {
  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('ref の初期値', (): void => {
    it('keyword の初期値が空文字であること', (): void => {
      const { keyword } = useStaticPagesMaker()
      expect(keyword.value).toBe('')
    })

    it('errorMessage の初期値が空文字であること', (): void => {
      const { errorMessage } = useStaticPagesMaker()
      expect(errorMessage.value).toBe('')
    })

    it('isOpen の初期値が false であること', (): void => {
      const { isOpen } = useStaticPagesMaker()
      expect(isOpen.value).toBe(false)
    })

    it('makers の初期値が空の配列であること', (): void => {
      const { makers } = useStaticPagesMaker()
      expect(makers.value).toEqual([])
    })
  })

  describe('関数のロジック', (): void => {
    describe('fetchMakerList', (): void => {
      it('関数を実行すると、メーカーリストが取得できること', async (): Promise<void> => {
        vi.mocked(axios).get.mockResolvedValueOnce({
          data: [
            { id: 1, name: '東亜電化工業株式会社' },
            { id: 2, name: '新星コーティングス' },
            { id: 3, name: '大和表面技術研究所' },
          ]
        })

        const { makers, fetchMakerList } = useStaticPagesMaker()
        await fetchMakerList()

        expect(makers.value).toEqual([
          '東亜電化工業株式会社',
          '新星コーティングス',
          '大和表面技術研究所',
        ])
      })
    })

    describe('close', (): void => {
      beforeEach((): void => {
        vi.useFakeTimers()
      })

      afterEach((): void => {
        vi.useRealTimers()
      })

      it('関数を実行すると、isOpen が false に変更されること', (): void => {
        const { isOpen, close } = useStaticPagesMaker()
        isOpen.value = true

        close()
        expect(isOpen.value).toBe(true)  // タイマー発火前はまだ true のまま

        vi.advanceTimersByTime(100)
        expect(isOpen.value).toBe(false)
      })
    })

    describe('filteredList', (): void => {
      describe('キーワードが未入力の場合', (): void => {
        it('空の配列が返ること', (): void => {
          const { keyword, filteredList } = useStaticPagesMaker()
          keyword.value = ''

          expect(filteredList.value).toEqual([])
        })
      })

      describe('正しいキーワードが入力された場合', (): void => {
        const sampleMakers: string[] = [
          '東亜電化工業株式会社',
          '富士理化研磨株式会社',
          'Horizon Vertex Inc.'
        ]

        it('キーワードに一致する複数のメーカーが返ること', (): void => {
          const { keyword, makers, filteredList } = useStaticPagesMaker()
          makers.value = sampleMakers

          keyword.value = '株式会社'
          expect(filteredList.value).toEqual([
            '東亜電化工業株式会社',
            '富士理化研磨株式会社',
          ])
        })

        it('キーワードが大文字でも大文字小文字を無視してフィルタされること', (): void => {
          const { keyword, makers, filteredList } = useStaticPagesMaker()
          makers.value = sampleMakers

          keyword.value = 'HORIZON'
          expect(filteredList.value).toEqual([
            'Horizon Vertex Inc.'
          ])
        })
      })
    })

    describe('select', (): void => {
      it('関数に引数を渡すと、引数の値がキーワードとして使えること', (): void => {
        const { keyword, select } = useStaticPagesMaker()
        select('キーワード')

        expect(keyword.value).toBe('キーワード')
      })

      it('関数に引数を渡すと、isOpen が false に変更されること', (): void => {
        const { isOpen, select } = useStaticPagesMaker()
        select('キーワード')

        expect(isOpen.value).toBe(false)
      })
    })

    describe('submitSearch', (): void => {
      describe('キーワードを未入力で送信した場合', (): void => {
        it('エラーになること', (): void => {
          const { keyword, errorMessage, submitSearch } = useStaticPagesMaker()
          keyword.value = ''
          submitSearch()

          expect(errorMessage.value).toBe('キーワードが未入力です')
        })
      })

      describe('正しいキーワードを送信した場合', (): void => {
        it('SearchResults ルートへ正しいパラメータで遷移すること', (): void => {
          const { keyword, submitSearch } = useStaticPagesMaker()
          keyword.value = '東亜'
          submitSearch()

          expect(pushMock).toHaveBeenCalledWith({
            name: 'SearchResults',
            params: { searchMethod: 'maker'},
            query: { keyword: keyword.value },
          })
        })

        it('エラーメッセージがリセットされること', (): void => {
          const { keyword, errorMessage, submitSearch } = useStaticPagesMaker()
          keyword.value = ''
          submitSearch()

          expect(errorMessage.value).toBe('キーワードが未入力です')

          keyword.value = '東亜'
          submitSearch()

          expect(errorMessage.value).toBe('')
        })
      })
    })
  })
})
