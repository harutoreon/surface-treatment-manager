import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSamplesShow } from '@/composables/samples/useSamplesShow.ts'
import type { Sample, User, Comment, Emit } from '@/composables/samples/useSamplesShow.ts'
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

describe('useSamplesShow', (): void => {
  const emitMock: Emit = vi.fn()

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期値の検証', (): void => {
    it('sampleComments の初期値が空の配列であること', (): void => {
      const { sampleComments } = useSamplesShow(emitMock)
      expect(sampleComments.value).toEqual([])
    })

    it('isAdmin の初期値が false であること', (): void => {
      const { isAdmin } = useSamplesShow(emitMock)
      expect(isAdmin.value).toBe(false)
    })

    it('sample の初期値が空のオブジェクトであること', (): void => {
      const { sample } = useSamplesShow(emitMock)
      expect(sample.value).toEqual({
        id: null,
        name: '',
        color: '',
        hardness: '',
        film_thickness: '',
        feature: '',
        summary: '',
        maker_id: null,
        category_id: null,
        image_url: '',
      })
    })

    it('user の初期値が空のオブジェクトであること', (): void => {
      const { user } = useSamplesShow(emitMock)
      expect(user.value).toEqual({
        id: null,
        name: '',
        department: '',
        admin: false,
      })
    })
  })

  describe('ロジックの検証', (): void => {
    describe('fetchSampleData', (): void => {
      const adminUserId: number = 49

      const mockUserResponse: User = {
        id: adminUserId,
        name: 'admin user',
        department: 'sample department',
        admin: true
      }

      const mockSampleResponse: Sample = {
        id: 1,
        name: 'sample name',
        color: 'sample color',
        hardness: 'sample hardness',
        film_thickness: 'sample hardness',
        feature: 'sample feature',
        summary: 'sample summary',
        maker_id: 1,
        category_id: 1,
        image_url: 'http://example.com',
      }

      beforeEach((): void => {
        vi.mocked(axios.get).mockResolvedValueOnce({ data: { payload: { user_id: mockUserResponse.id } } })
        vi.mocked(axios.get).mockResolvedValueOnce({ data: mockUserResponse })
      })

      describe('リクエストに成功した場合', (): void => {
        it('レスポンスにサンプル情報が含まれること', async (): Promise<void> => {
          vi.mocked(axios.get).mockResolvedValueOnce({ data: mockSampleResponse })

          const { sample, fetchSampleData } = useSamplesShow(emitMock)
          await fetchSampleData('1')

          expect(sample.value).toEqual(mockSampleResponse)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 404 } })
          vi.mocked(axios.isAxiosError).mockReturnValue(true)

          const { fetchSampleData } = useSamplesShow(emitMock)
          await fetchSampleData('1')

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: '表面処理情報の取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })

    describe('fetchSampleCommentData', (): void => {
      const mockResponse: Comment = {
        id: 1,
        commenter: 'sample commenter',
        body: 'sample body',
        sample_id: 1,
        department: 'sample department',
        created_at: '2026/12/29'
      }

      describe('リクエストに成功した場合', (): void => {
        it('レスポンスがコメント一覧であること', async (): Promise<void> => {
          vi.mocked(axios.get).mockResolvedValue({ data: mockResponse })

          const { sampleComments, fetchSampleCommentsData } = useSamplesShow(emitMock)
          await fetchSampleCommentsData('1')

          expect(sampleComments.value).toEqual(mockResponse)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージが含まれ、NotFound ルートに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } })
          vi.mocked(axios.isAxiosError).mockReturnValue(true)

          const { fetchSampleCommentsData } = useSamplesShow(emitMock)
          await fetchSampleCommentsData('1')

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: 'コメントの取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })
  })
})

