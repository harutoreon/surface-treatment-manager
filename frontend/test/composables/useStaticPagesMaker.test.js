import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useStaticPagesMaker } from '@/composables/useStaticPagesMaker.js'
import axios from 'axios'
import { useRouter } from 'vue-router'

vi.mock('axios')
vi.mock('vue-router')

describe('useStaticPagesMaker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('ref の初期値', () => {
    it('keyword の初期値が空文字であること', () => {
      const { keyword } = useStaticPagesMaker()
      expect(keyword.value).toBe('')
    })

    it('errorMessage の初期値が空文字であること', () => {
      const { errorMessage } = useStaticPagesMaker()
      expect(errorMessage.value).toBe('')
    })

    it('isOpen の初期値が false であること', () => {
      const { isOpen } = useStaticPagesMaker()
      expect(isOpen.value).toBe(false)
    })

    it('makers の初期値が空の配列であること', () => {
      const { makers } = useStaticPagesMaker()
      expect(makers.value).toEqual([])
    })

    it('makerList の初期値が空の配列であること', () => {
      const { makerList } = useStaticPagesMaker()
      expect(makerList.value).toEqual([])
    })
  })

  describe('関数のロジック', () => {
    describe('fetchMakerList', () => {
      it('関数を実行すると、メーカーリストが取得できること', async () => {
        vi.mocked(axios).get.mockResolvedValue({
          data: [
            { id: 1, name: '東亜電化工業株式会社' },
            { id: 2, name: '新星コーティングス' },
            { id: 3, name: '大和表面技術研究所' },
          ]
        })

        const { makerList, makers, fetchMakerList } = useStaticPagesMaker()
        await fetchMakerList()

        expect(makerList.value).toEqual([
          { id: 1, name: '東亜電化工業株式会社' },
          { id: 2, name: '新星コーティングス' },
          { id: 3, name: '大和表面技術研究所' },
        ])
        expect(makers.value).toEqual([
          '東亜電化工業株式会社',
          '新星コーティングス',
          '大和表面技術研究所',
        ])
      })
    })

    describe('close', () => {
      beforeEach(() => {
        vi.useFakeTimers()
      })

      afterEach(() => {
        vi.useRealTimers()
      })

      it('関数を実行すると、isOpen が false に変更されること', () => {
        const { isOpen, close } = useStaticPagesMaker()
        isOpen.value = true

        close()
        expect(isOpen.value).toBe(true)

        vi.advanceTimersByTime(100)
        expect(isOpen.value).toBe(false)
      })
    })

    describe('filteredList', () => {
      describe('キーワードが未入力の場合', () => {
        it('空の配列が返ること', () => {
          const { keyword, filteredList } = useStaticPagesMaker()
          keyword.value = ''

          expect(filteredList.value).toEqual([])
        })
      })

      describe('正しいキーワードが入力された場合', () => {
        it('キーワードが含まれるメーカーが取得できること', () => {
          const { keyword, makers, filteredList } = useStaticPagesMaker()
          makers.value = [
            '東亜電化工業株式会社',
            '富士理化研磨株式会社',
            'Horizon Vertex Inc.'
          ]

          // 複数のメーカーが取得できるか
          keyword.value = '株式会社'
          expect(filteredList.value).toEqual([
            '東亜電化工業株式会社',
            '富士理化研磨株式会社',
          ])

          // キーワードが大文字でも取得できるか
          keyword.value = 'HORIZON'
          expect(filteredList.value).toEqual([
            'Horizon Vertex Inc.'
          ])
        })
      })
    })

    describe('select', () => {
      it('関数に引数を渡すと、引数の値がキーワードとして使えること', () => {
        const { keyword, select } = useStaticPagesMaker()
        select('キーワード')

        expect(keyword.value).toBe('キーワード')
      })

      it('関数に引数を渡すと、isOpen が false に変更されること', () => {
        const { isOpen, select } = useStaticPagesMaker()
        select('キーワード')

        expect(isOpen.value).toBe(false)
      })
    })

    describe('submitSearch', () => {
      describe('キーワードを未入力で送信した場合', () => {
        it('エラーになること', () => {
          const { keyword, errorMessage, submitSearch } = useStaticPagesMaker()
          keyword.value = ''
          submitSearch()

          expect(errorMessage.value).toBe('キーワードが未入力です')
        })
      })

      describe('正しいキーワードを送信した場合', () => {
        it('SearchResults ルートへ正しいパラメータで遷移すること', () => {
          const pushMock = vi.fn()
          vi.mocked(useRouter).mockReturnValue({ push: pushMock })

          const { keyword, submitSearch } = useStaticPagesMaker()
          keyword.value = '東亜'
          submitSearch()

          expect(pushMock).toHaveBeenCalledWith({
            name: 'SearchResults',
            params: { searchMethod: 'maker'},
            query: { keyword: keyword.value },
          })
        })

        it('エラーメッセージがリセットされること', () => {
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
