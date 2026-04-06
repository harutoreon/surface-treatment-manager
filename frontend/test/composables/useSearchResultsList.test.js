import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { useSearchResultsList } from '@/composables/useSearchResultsList.js'

const replaceMock = vi.fn()
const pushMock = vi.fn()

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

vi.mock('axios')

describe('useSearchResultsList', () => {
  describe('fetchSearchResults', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    describe('リクエストに成功した場合', () => {
      it('samplesにレスポンスのデータが格納されること', async () => {
        const mockResponse = [
          {
            id: 1,
            name: '表面処理名',
            summary: '概要文',
            image_url: 'http://test-api/test.jpg',
          }
        ]

        axios.get.mockResolvedValue({ data: mockResponse })

        const { samples, fetchSearchResults } = useSearchResultsList()
        await fetchSearchResults()

        expect(samples.value).toEqual(mockResponse)
      })
    })

    describe('リクエストに失敗した場合', () => {
      it('エラーメッセージをemitして、NotFoundへリダイレクトすること', async () => {
        axios.get.mockRejectedValue({
          response: {
            status: 404
          }
        })

        const emitMock = vi.fn()
        const { fetchSearchResults } = useSearchResultsList(emitMock)
        await fetchSearchResults()

        expect(emitMock).toHaveBeenCalledTimes(1)
        expect(emitMock).toHaveBeenCalledWith('message', {
          type: 'danger',
          text: 'サンプルの取得に失敗しました。'
        })
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })
})