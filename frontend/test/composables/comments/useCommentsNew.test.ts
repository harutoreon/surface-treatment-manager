import { describe, it, expect,vi, beforeEach } from 'vitest'
import { useCommentsNew } from '@/composables/comments/useCommentsNew.ts'
import type { Maker, SampleResponse, Comment, Emit } from '@/composables/comments/useCommentsNew.ts'
import axios from 'axios'

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

describe('useCommentsNew', (): void => {
  const emitMock: Emit = vi.fn()

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期値の検証', (): void => {
    it('commenter の初期値が空文字であること', (): void => {
      const { commenter } = useCommentsNew(emitMock)
      expect(commenter.value).toBe('')
    })

    it('department の初期値が空文字であること', (): void => {
      const { department } = useCommentsNew(emitMock)
      expect(department.value).toBe('')
    })

    it('body の初期値が空文字であること', (): void => {
      const { body } = useCommentsNew(emitMock)
      expect(body.value).toBe('')
    })

    it('comment の初期値が null であること', (): void => {
      const { comment } = useCommentsNew(emitMock)
      expect(comment.value).toBeNull()
    })

    it('users の初期値が空の配列であること', (): void => {
      const { users } = useCommentsNew(emitMock)
      expect(users.value).toEqual([])
    })

    it('makerOptions の初期値が空の配列であること', (): void => {
      const { makerOptions } = useCommentsNew(emitMock)
      expect(makerOptions.value).toEqual([])
    })

    it('sampleOptions の初期値が空の配列であること', (): void => {
      const { sampleOptions } = useCommentsNew(emitMock)
      expect(sampleOptions.value).toEqual([])
    })

    it('errorMessage の初期値が空文字であること', (): void => {
      const { errorMessage } = useCommentsNew(emitMock)
      expect(errorMessage.value).toBe('')
    })

    it('userId の初期値が null であること', (): void => {
      const { userId } = useCommentsNew(emitMock)
      expect(userId.value).toBeNull()
    })

    it('makerId の初期値が null であること', (): void => {
      const { makerId } = useCommentsNew(emitMock)
      expect(makerId.value).toBeNull()
    })

    it('sampleId の初期値が null であること', (): void => {
      const { sampleId } = useCommentsNew(emitMock)
      expect(sampleId.value).toBeNull()
    })
  })

  describe('ロジックの検証', (): void => {
    // fetchUserList()



    describe('fetchMakerDate', (): void => {
      describe('リクエストに成功した場合', (): void => {
        it('レスポンスがメーカーリストであること', async (): Promise<void> => {
          const mockMakerResponse: Maker[] = [
            {
              id: 1,
              name: '東亜電化工業株式会社'
            }
          ]

          vi.mocked(axios.get).mockResolvedValue({ data: mockMakerResponse })

          const { makerOptions, fetchMakerData } = useCommentsNew(emitMock)
          await fetchMakerData()

          expect(makerOptions.value).toEqual(mockMakerResponse)
        })
      })
      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } })

          const { fetchMakerData } = useCommentsNew(emitMock)
          await fetchMakerData()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: 'メーカーリストの取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })

    describe('fetchSampleData', (): void => {
      const mockSampleResponse: SampleResponse = {
        samples: [
          {
            id: 1,
            category_id: 1,
            color: "イエローブラウンシルバー",
            feature: "耐食性・耐摩耗性・耐薬品性・耐熱性",
            film_thickness: "通常は3～5μm、厚めの場合は20～50μmまで可能",
            hardness: "析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度",
            maker_id: 1,
            name: "無電解ニッケルめっき",
            summary: "電気を使わず化学反応で金属表面にニッケルを析出する技術です。",
          },
        ],
        current_page: 1,
        total_pages: 1
      }

      describe('リクエストに成功した場合', (): void => {
        it('レスポンスが表面処理リストであること', async (): Promise<void> => {
          vi.mocked(axios.get).mockResolvedValueOnce({ data: mockSampleResponse })

          const {
            makerId,
            sampleOptions,
            fetchSampleData
          } = useCommentsNew(emitMock)

          makerId.value = mockSampleResponse.samples[0].id
          await fetchSampleData()

          expect(sampleOptions.value).toEqual(mockSampleResponse.samples)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } })

          const { makerId, fetchSampleData } = useCommentsNew(emitMock)
          makerId.value = mockSampleResponse.samples[0].id
          await fetchSampleData()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: '表面処理リストの取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })

    describe('commentRegistration', (): void => {
      const mockCommentResponse: Comment = {
        id: 1,
        commenter: '岩崎 颯太',
        department: '品質管理部',
        body: '耐久性が高く、長期間の使用に耐えられる仕上がりです。',
        sample_id: 1,
        user_id: 1,
      }

      describe('リクエストに成功した場合', (): void => {
        it('レスポンスにエラーメッセージを含み、コメント詳細ページに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.post).mockResolvedValue({ data: mockCommentResponse })

          const {
            comment,
            commentRegistration
          } = useCommentsNew(emitMock)

          await commentRegistration()

          expect(comment.value).toEqual(mockCommentResponse)
          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'success', text: 'コメント情報を1件登録しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith(`/comments/${comment.value.id}`)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('バリデーションエラーになること', async (): Promise<void> => {
          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios.post).mockRejectedValue({ response: { status: 422 } })

          const {
            errorMessage,
            commentRegistration
          } = useCommentsNew(emitMock)

          await commentRegistration()

          expect(errorMessage.value).toBe('入力に不備があります。')
        })
      })
    })
  })
})