import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSamplesEdit } from '@/composables/samples/useSamplesEdit.ts'
import type { Emit, Sample } from '@/composables/samples/useSamplesEdit.ts'
import axios from 'axios'

const replaceMock: ReturnType<typeof vi.fn> = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        replace: replaceMock,
      }
    }
  }
})

describe('useSamplesEdit', (): void => {
  const emitMock: Emit = vi.fn()

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期値の検証', (): void => {
    it('sample の初期値が null であること', (): void => {
      const { sample } = useSamplesEdit(emitMock)
      expect(sample.value).toBeNull()
    })

    it('image の初期値が null であること', (): void => {
      const { image } = useSamplesEdit(emitMock)
      expect(image.value).toBeNull()
    })

    it('errorMessage の初期値が空文字であること', (): void => {
      const { errorMessage } = useSamplesEdit(emitMock)
      expect(errorMessage.value).toBe('')
    })
  })

  describe('ロジックの検証', (): void => {
    describe('fetchSampleData', (): void => {
      describe('リクエストに成功した場合', (): void => {
        it('レスポンスがサンプル情報であること', async (): Promise<void> => {
          const mockResponse: Sample = {
            id: 1,
            name: '無電解ニッケルめっき',
            color: 'コールド',
            hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
            film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
            feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
            summary: '電気を使わず化学反応で金属表面にニッケルを析出する技術です。',
            maker_id: 1,
            category_id: 1,
            image_url: 'https://example.com/images/test-image.png',
          }

          vi.mocked(axios.get).mockResolvedValue({ data: mockResponse })

          const { sample, fetchSampleData } = useSamplesEdit(emitMock)
          await fetchSampleData('1')

          expect(sample.value).toEqual(mockResponse)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } })
          vi.mocked(axios.isAxiosError).mockReturnValue(true)

          const { fetchSampleData } = useSamplesEdit(emitMock)
          await fetchSampleData('1')

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: '表面処理情報の取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })

    describe('sampleUpdate', (): void => {
      const mockResponse: Sample = {
        id: 1,
        name: '無電解ニッケルめっき',
        color: 'コールド',
        hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
        film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
        feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
        summary: '電気を使わず化学反応で金属表面にニッケルを析出する技術です。',
        maker_id: 1,
        category_id: 1,
        image_url: 'https://example.com/images/test-image.png',
      }

      describe('リクエストに成功した場合', (): void => {
        it('レスポンスに成功メッセージを含み、詳細ページに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.get).mockResolvedValueOnce({ data: mockResponse })
          vi.mocked(axios.patch).mockResolvedValueOnce({ data: mockResponse })

          const {
            sample,
            fetchSampleData,
            sampleUpdate
          } = useSamplesEdit(emitMock)

          await fetchSampleData('1')
          await sampleUpdate()

          expect(sample.value).toEqual(mockResponse)
          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'success', text: '表面処理情報を更新しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith('/samples/1')
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('バリデーションエラーになること', async (): Promise<void> => {
          vi.mocked(axios.get).mockResolvedValueOnce({ data: mockResponse })
          vi.mocked(axios.patch).mockRejectedValueOnce({ response: { status: 422 } })
          vi.mocked(axios.isAxiosError).mockReturnValue(true)

          const {
            errorMessage,
            fetchSampleData,
            sampleUpdate
          } = useSamplesEdit(emitMock)
          await fetchSampleData('1')
          await sampleUpdate()

          expect(errorMessage.value).toBe('入力に不備があります。')
        })
      })
    })
  })
})
