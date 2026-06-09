import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useCategories } from '@/composables/useCategories.js'
import axios from 'axios'

const replaceMock = vi.fn()
const pushMock = vi.fn()

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

describe('useCategories', () => {
  const emitMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('初期値の検証', () => {
    it('item の初期値が空文字であること', () => {
      const { item } = useCategories(emitMock)
      expect(item.value).toBe('')
    })

    it('summary の初期値が空文字であること', () => {
      const { summary } = useCategories(emitMock)
      expect(summary.value).toBe('')
    })

    it('categories の初期値が空の配列であること', () => {
      const { categories } = useCategories(emitMock)
      expect(categories.value).toEqual([])
    })

    it('category の初期値が空文字であること', () => {
      const { category } = useCategories(emitMock)
      expect(category.value).toBe('')
    })

    it('errorMessage の初期値が空文字であること', () => {
      const { errorMessage } = useCategories(emitMock)
      expect(errorMessage.value).toBe('')
    })
  })

  describe('ロジックの検証', () => {
    describe('replaceStringWithEllipsis', () => {
      describe('概要文が 10 文字未満の場合', () => {
        it('省略されないこと', () => {
          const { categories, replaceStringWithEllipsis } = useCategories(emitMock)

          categories.value = [
            {
              id: 1,
              item: 'めっき',
              summary: '金属または非金属'
            }
          ]

          replaceStringWithEllipsis()

          expect(categories.value[0].summary).toBe(
            '金属または非金属'
          )
        })
      })

      describe('概要文が 10 文字を超える場合', () => {
        it('省略されること', () => {
          const { categories, replaceStringWithEllipsis } = useCategories(emitMock)

          categories.value = [
            {
              id: 1,
              item: 'めっき',
              summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
            }
          ]

          replaceStringWithEllipsis()

          expect(categories.value[0].summary).toBe(
            '金属または非金属の材...'
          )
        })
      })
    })

    describe('fetchCategoryList', () => {
      describe('リクエストに成功した場合', () => {
        it('レスポンスがカテゴリーリストであること', async () => {
          const mockResponse = [
            {
              id: 1,
              item: 'めっき',
              summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
            }
          ]

          vi.mocked(axios.get).mockResolvedValue({ data: mockResponse })

          const { categories, fetchCategoryList,  } = useCategories(emitMock)
          await fetchCategoryList()

          expect(categories.value).toEqual(mockResponse)
          expect(categories.value[0].summary).toEqual(mockResponse[0].summary)
        })
      })

      describe('リクエストに失敗した場合', () => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートに遷移すること', async () => {
          vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } })

          const { fetchCategoryList } = useCategories(emitMock)
          await fetchCategoryList()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: 'カテゴリーの取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })

    describe('fetchCategoryData', () => {
      describe('リクエストに成功した場合', () => {
        it('レスポンスがカテゴリー情報であること', async () => {
          const mockResponse = {
            id: 1,
            item: 'めっき',
            summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
          }

          vi.mocked(axios.get).mockResolvedValue({ data: mockResponse })

          const { category, fetchCategoryData } = useCategories(emitMock)
          await fetchCategoryData('1')

          expect(category.value).toEqual(mockResponse)
        })
      })

      describe('リクエストに失敗した場合', () => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートに遷移すること', async () => {
          vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } })

          const { fetchCategoryData } = useCategories(emitMock)
          await fetchCategoryData('1')

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: 'カテゴリーの取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })

    describe('categoryRegistration', () => {
      describe('リクエストに成功した場合', () => {
        it('レスポンスに成功メッセージが含まれ、/categories/:id ルートに遷移すること', async () => {
          const mockResponse = {
            id: 1,
            item: 'めっき',
            summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
          }

          vi.mocked(axios.post).mockResolvedValue({ data: mockResponse })

          const { category, categoryRegistration } = useCategories(emitMock)
          await categoryRegistration()

          expect(category.value).toEqual(mockResponse)
          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'success', text: 'カテゴリーを1件登録しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith(`/categories/${mockResponse.id}`)
        })
      })

      describe('リクエストに失敗した場合', () => {
        it('バリデーションエラーになること', async () => {
          vi.mocked(axios.post).mockRejectedValue(new Error('Validation Error'))

          const { errorMessage, categoryRegistration } = useCategories(emitMock)
          await categoryRegistration()

          expect(errorMessage.value).toBe('入力に不備があります。')
        })
      })
    })

    describe('categoryUpdate', () => {
      describe('リクエストに成功した場合', () => {
        it('レスポンスに成功メッセージを含み、/categories/:id ルートに遷移すること', async () => {
          const mockResponse = {
            id: 1,
            item: 'めっき',
            summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
          }

          vi.mocked(axios.patch).mockResolvedValue({ data: mockResponse })

          const { category, categoryUpdate } = useCategories(emitMock)
          await categoryUpdate()

          expect(category.value).toEqual(mockResponse)
          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'success', text: 'カテゴリー情報を更新しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith(`/categories/${mockResponse.id}`)
        })
      })

      describe('リクエストに失敗した場合', () => {
        it('バリデーションエラーになること', async () => {
          vi.mocked(axios.patch).mockRejectedValue(new Error('Validation Error'))

          const { errorMessage, categoryUpdate } = useCategories(emitMock)
          await categoryUpdate()

          expect(errorMessage.value).toBe('入力に不備があります。')
        })
      })
    })

    describe('handleDelete', () => {
      beforeEach(() => {
        vi.stubGlobal('confirm', vi.fn(() => true))
      })

      afterEach(() => {
        vi.unstubAllGlobals()
      })

      describe('リクエストに成功した場合', () => {
        it('レスポンスに成功メッセージを含み、/categories ルートに遷移すること', async () => {
          vi.mocked(axios.delete).mockResolvedValue({ data: { status: 204} })
          const { handleDelete } = useCategories(emitMock)
          await handleDelete()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'success', text: 'カテゴリーを1件削除しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith('/categories')
        })
      })

      describe('リクエストに失敗した場合', () => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートに遷移すること', async () => {
          vi.mocked(axios.delete).mockRejectedValue({ response: { status: 404 } })

          const { handleDelete } = useCategories(emitMock)
          await handleDelete()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: '削除処理に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })
  })
})
