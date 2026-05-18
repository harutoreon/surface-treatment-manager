import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useSamplesDestroy } from '@/composables/samples/useSamplesDestroy.ts'
import type { Emit, Sample } from '@/composables/samples/useSamplesDestroy.ts'
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

describe('useSamplesDestroy', (): void => {
  const emitMock: Emit = vi.fn()

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期値の検証', (): void => {
    it('sample の初期値が null であること', (): void => {
      const { sample } = useSamplesDestroy(emitMock)
      expect(sample.value).toBeNull()
    })
  })

  describe('ロジックの検証', (): void => {
    describe('handleDelete', (): void => {
      const testSample: Sample = {
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

      beforeEach((): void => {
        vi.stubGlobal('confirm', vi.fn(() => true))
      })

      afterEach((): void => {
        vi.unstubAllGlobals()
      })

      describe('リクエストに成功した場合', (): void => {
        it('レスポンスに成功メッセージを含み、/samples に遷移すること', async (): Promise<void> => {
          vi.mocked(axios.delete).mockResolvedValue({ status: 204})

          const { sample, handleDelete } = useSamplesDestroy(emitMock)

          sample.value = testSample

          await handleDelete()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'success', text: '表面処理情報を削除しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith('/samples')
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios.delete).mockRejectedValue({ response: { status: 404 } })

          const { sample, handleDelete } = useSamplesDestroy(emitMock)

          sample.value = testSample

          await handleDelete()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: '表面処理情報の削除処理に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound'})
        })
      })
    })
  })
})