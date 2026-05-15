import {describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useMakers } from '@/composables/useMakers.ts'
import axios from 'axios'

const replaceMock: ReturnType<typeof vi.fn> = vi.fn()
const pushMock: ReturnType<typeof vi.fn> = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        params: { id: '1' },
        query: { page: '1' },
      }
    },
    useRouter: () => {
      return {
        replace: replaceMock,
        push: pushMock,
      }
    },
  }
})

interface EmitFn {
  (event: 'message', payload: { type: 'success' | 'danger'; text: string }): void
}

describe('useMakers', (): void => {
  const emitMock = vi.fn() as EmitFn

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期値の検証', (): void => {
    it('maker の初期値が空のオブジェクトであること', (): void => {
      const { maker } = useMakers(emitMock)
      expect(maker.value).toEqual({
        id: '',
        name: '',
        postal_code: '',
        address: '',
        phone_number: '',
        fax_number: '',
        email: '',
        home_page: '',
        manufacturer_rep: ''
      })
    })

    it('makers の初期値が空の配列であること', (): void => {
      const { makers } = useMakers(emitMock)
      expect(makers.value).toEqual([])
    })

    it('currentPage の初期値が 1 であること', (): void => {
      const { currentPage } = useMakers(emitMock)
      expect(currentPage.value).toBe(1)
    })

    it('totalPages の初期値が 1 であること', ():void => {
      const { totalPages } = useMakers(emitMock)
      expect(totalPages.value).toBe(1)
    })

    it('name の初期値が空文字であること', (): void => {
      const { name } = useMakers(emitMock)
      expect(name.value).toBe('')
    })

    it('postalCode の初期値が空文字であること', (): void => {
      const { postalCode } = useMakers(emitMock)
      expect(postalCode.value).toBe('')
    })

    it('address の初期値が空文字であること', (): void => {
      const { address } = useMakers(emitMock)
      expect(address.value).toBe('')
    })

    it('phoneNumber の初期値が空文字であること', (): void => {
      const { phoneNumber } = useMakers(emitMock)
      expect(phoneNumber.value).toBe('')
    })

    it('faxNumber の初期値が空文字であること', (): void => {
      const { faxNumber } = useMakers(emitMock)
      expect(faxNumber.value).toBe('')
    })

    it('email の初期値が空文字であること', (): void => {
      const { email } = useMakers(emitMock)
      expect(email.value).toBe('')
    })

    it('homePage の初期値が空文字であること', (): void => {
      const { homePage } = useMakers(emitMock)
      expect(homePage.value).toBe('')
    })

    it('manufacturerRep の初期値が空文字であること', (): void => {
      const { manufacturerRep } = useMakers(emitMock)
      expect(manufacturerRep.value).toBe('')
    })

    it('errorMessage の初期値が空文字であること', (): void => {
      const { errorMessage } = useMakers(emitMock)
      expect(errorMessage.value).toBe('')
    })
  })

  describe('ロジックの検証', (): void => {
    describe('fetchMakerList', (): void => {
      describe('リクエストに成功した場合', (): void => {
        it('レスポンスはメーカーリストとページ情報であること', async (): Promise<void> => {
          const mockResponse = {
            makers: [
              {
                id: 1,
                name: '東亜電化工業株式会社',
                address: '山口県西悠斗町1-2-1',
                phone_number: '070-8007-8335',
                fax_number: '080-4377-8360',
              },
            ],
            current_page: 1,
            total_pages: 1
          }

          vi.mocked(axios.get).mockResolvedValue({ data: mockResponse })

          const {
            makers,
            currentPage,
            totalPages,
            fetchMakerList
          } = useMakers(emitMock)

          await fetchMakerList()

          expect(makers.value).toEqual(mockResponse.makers)
          expect(currentPage.value).toBe(mockResponse.current_page)
          expect(totalPages.value).toBe(mockResponse.total_pages)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートの呼び出しがあること', async (): Promise<void> => {
          vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } })

          const { fetchMakerList } = useMakers(emitMock)
          await fetchMakerList()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: 'メーカーリストの取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })

    describe('fetchMakerData', (): void => {
      describe('リクエストに成功した場合', (): void => {
        it('レスポンスはメーカー情報であること', async (): Promise<void> => {
          const mockResponse = {
            id: 1,
            name: '有限会社中野銀行',
            postal_code: '962-0713',
            address: '東京都渋谷区神南1-2-0',
            phone_number: '070-3288-2552',
            fax_number: '070-2623-8399',
            email: 'sample_maker0@example.com',
            home_page: 'https://example.com/sample_maker0',
            manufacturer_rep: '宮本 悠斗'
          }

          vi.mocked(axios.get).mockResolvedValue({ data: mockResponse })

          const { maker, fetchMakerData } = useMakers(emitMock)
          await fetchMakerData('1')

          expect(maker.value).toEqual(mockResponse)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートの呼び出しがあること', async (): Promise<void> => {
          vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } })

          const { fetchMakerData } = useMakers(emitMock)
          await fetchMakerData('1')

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: 'メーカー情報の取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })

    describe('makerRegistration', (): void => {
      describe('リクエストに成功した場合', (): void => {
        it('レスポンスにメーカー情報と成功メッセージを含み、メーカー情報ページに遷移すること', async (): Promise<void> => {
          const mockResponse = {
            id: 1,
            name: '有限会社中野銀行',
            postal_code: '962-0713',
            address: '東京都渋谷区神南1-2-0',
            phone_number: '070-3288-2552',
            fax_number: '070-2623-8399',
            email: 'sample_maker0@example.com',
            home_page: 'https://example.com/sample_maker0',
            manufacturer_rep: '宮本 悠斗'
          }

          vi.mocked(axios.post).mockResolvedValue({ data: mockResponse })

          const { maker, makerRegistration } = useMakers(emitMock)
          await makerRegistration()

          expect(maker.value).toEqual(mockResponse)
          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'success', text: 'メーカー情報を1件登録しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith(`/makers/${mockResponse.id}`)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('バリデーションエラーになること', async (): Promise<void> => {
          vi.mocked(axios.post).mockRejectedValue({ response: { status: 422 } })
          vi.mocked(axios.isAxiosError).mockReturnValue(true)

          const { errorMessage, makerRegistration } = useMakers(emitMock)
          await makerRegistration()

          expect(errorMessage.value).toBe('入力に不備があります。')
        })
      })
    })

    describe('makerUpdate', (): void => {
      describe('リクエストに成功した場合', (): void => {
        it('レスポンスにメーカー情報と成功メッセージを含み、メーカー情報ページに遷移すること', async (): Promise<void> => {
          const mockResponse = {
            id: 1,
            name: '有限会社中野銀行',
            postal_code: '962-0713',
            address: '東京都渋谷区神南1-2-0',
            phone_number: '070-3288-2552',
            fax_number: '070-2623-8399',
            email: 'sample_maker0@example.com',
            home_page: 'https://example.com/sample_maker0',
            manufacturer_rep: '宮本 悠斗'
          }

          vi.mocked(axios.patch).mockResolvedValue({ data: mockResponse })

          const { maker, makerUpdate } = useMakers(emitMock)
          await makerUpdate()

          expect(maker.value).toEqual(mockResponse)
          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'success', text: 'メーカー情報を更新しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith(`/makers/${maker.value.id}`)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('バリデーションエラーになること', async (): Promise<void> => {
          vi.mocked(axios.patch).mockRejectedValue({ response: { status: 422 } })
          vi.mocked(axios.isAxiosError).mockReturnValue(true)

          const { errorMessage, makerUpdate } = useMakers(emitMock)
          await makerUpdate()

          expect(errorMessage.value).toBe('入力に不備があります。')
        })
      })
    })

    describe('handleDelete', (): void => {
      beforeEach(async (): Promise<void> => {
        vi.stubGlobal('confirm', vi.fn(() => true))
      })

      afterEach(async (): Promise<void> => {
        vi.unstubAllGlobals()
      })

      describe('リクエストに成功した場合', (): void => {
        it('レスポンスに成功メッセージを含み、メーカーリストページに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.delete).mockResolvedValue({ status: 204 })

          const { handleDelete } = useMakers(emitMock)
          await handleDelete()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'success', text: 'メーカー情報を1件削除しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith('/makers')
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.delete).mockRejectedValue({ response: { status: 404 } })

          const { handleDelete } = useMakers(emitMock)
          await handleDelete()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: 'メーカー情報の削除処理に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })
  })
})

