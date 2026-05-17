import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSamplesNew } from '@/composables/samples/useSamplesNew.ts'
import type { Emit, Maker, Category } from '@/composables/samples/useSamplesNew.ts'
import axios from 'axios'

const replaceMock: ReturnType<typeof vi.fn> = vi.fn()
const pushMock: ReturnType<typeof vi.fn> = vi.fn()

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

describe('useSamplesNew', (): void => {
  const emitMock: Emit = vi.fn()

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期値の検証', (): void => {
    it('makerOptions の初期値が空の配列であること', (): void => {
      const { makerOptions } = useSamplesNew(emitMock)
      expect(makerOptions.value).toEqual([])
    })

    it('categoryOptions の初期値が空の配列であること', (): void => {
      const { categoryOptions } = useSamplesNew(emitMock)
      expect(categoryOptions.value).toEqual([])
    })

    it('name の初期値が空文字であること', (): void => {
      const { name } = useSamplesNew(emitMock)
      expect(name.value).toBe('')
    })

    it('color の初期値が空文字であること', (): void => {
      const { color } = useSamplesNew(emitMock)
      expect(color.value).toBe('')
    })

    it('hardness の初期値が空文字であること', (): void => {
      const { hardness } = useSamplesNew(emitMock)
      expect(hardness.value).toBe('')
    })

    it('feature の初期値が空文字であること', (): void => {
      const { feature } = useSamplesNew(emitMock)
      expect(feature.value).toBe('')
    })

    it('categoryId の初期値が null であること', (): void => {
      const { categoryId } = useSamplesNew(emitMock)
      expect(categoryId.value).toBeNull()
    })

    it('makerId の初期値は null であること', (): void => {
      const { makerId } = useSamplesNew(emitMock)
      expect(makerId.value).toBeNull()
    })

    it('filmThickness の初期値は空文字であること', (): void => {
      const { filmThickness } = useSamplesNew(emitMock)
      expect(filmThickness.value).toBe('')
    })

    it('summary の初期値が空文字であること', (): void => {
      const { summary } = useSamplesNew(emitMock)
      expect(summary.value).toBe('')
    })

    it('image の初期値が null であること', (): void => {
      const { image } = useSamplesNew(emitMock)
      expect(image.value).toBeNull()
    })

    it('errorMessage の初期値が空文字であること', (): void => {
      const { errorMessage } = useSamplesNew(emitMock)
      expect(errorMessage.value).toBe('')
    })
  })

  describe('ロジックの検証', (): void => {
    describe('fetchMakerData', (): void => {
      describe('リクエストに成功した場合', (): void => {
        it('レスポンスがメーカーリストであること', async (): Promise<void> => {
          const mockResponse: Maker[] = [
            { id: 1, name: '東亜電化工業株式会社' }
          ]

          vi.mocked(axios.get).mockResolvedValue({ data: mockResponse })

          const { makerOptions, fetchMakerData } = useSamplesNew(emitMock)
          await fetchMakerData()

          expect(makerOptions.value).toEqual(mockResponse)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } })
          vi.mocked(axios.isAxiosError).mockReturnValue(true)

          const { fetchMakerData } = useSamplesNew(emitMock)
          await fetchMakerData()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: 'メーカーの取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })

    describe('fetchCategories', (): void => {
      describe('リクエストに成功した場合', (): void => {
        it('レスポンスがカテゴリーリストであること', async (): Promise<void> => {
          const mockResponse: Category[] = [
            {
              id: 1,
              item: 'めっき',
              summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
            }
          ]

          vi.mocked(axios.get).mockResolvedValue({ data: mockResponse })

          const { categoryOptions, fetchCategories } = useSamplesNew(emitMock)
          await fetchCategories()

          expect(categoryOptions.value).toEqual(mockResponse)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } })
          vi.mocked(axios.isAxiosError).mockReturnValue(true)

          const { fetchCategories } = useSamplesNew(emitMock)
          await fetchCategories()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: 'カテゴリーの取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })

    describe('sampleRegistration', (): void => {
      describe('リクエストに成功した場合', (): void => {
        it('レスポンスに登録成功のメッセージを含み、サンプルの詳細ページに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.post).mockResolvedValue({ data: { id: 1 } })

          const { sampleRegistration, categoryId, makerId } = useSamplesNew(emitMock)

          categoryId.value = 1
          makerId.value = 1

          await sampleRegistration()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'success', text: '表面処理情報を1件登録しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith('/samples/1')
          expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('/makers/1/samples'),
            expect.any(FormData),
            { headers: { 'Content-Type': 'multipart/form-data'} }
          )
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('バリデーションエラーになること', async (): Promise<void> => {
          vi.mocked(axios.post).mockRejectedValue({ response: { status: 422 } })
          vi.mocked(axios.isAxiosError).mockReturnValue(true)

          const { errorMessage, sampleRegistration, categoryId, makerId } = useSamplesNew(emitMock)

          categoryId.value = 1
          makerId.value = 1

          await sampleRegistration()

          expect(errorMessage.value).toBe('入力に不備があります。')
        })
      })
    })
  })
})
