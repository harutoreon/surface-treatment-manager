// コードレビューで指摘された箇所の修正

import SamplesEditView from '@/components/samples/SamplesEditView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import type { Sample, Emit } from '@/composables/samples/useSamplesEdit.ts'
import axios from 'axios'

const { replaceMock } = vi.hoisted(() => {
  return {
    replaceMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        params: { id: 1 }
      }
    },
    useRouter: () => {
      return {
        replace: replaceMock,
      }
    }
  }
})

describe('SamplesEditView', (): void => {
  const mockResponse: Sample = {
    id: 1,
    name: '無電解ニッケルめっき',
    color: 'ゴールド',
    hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
    film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
    feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
    summary: '電気を使わず化学反応で金属表面にニッケルを析出する技術です。',
    maker_id: 1,
    category_id: 1,
    image_url: 'http://localhost:3000/rails/active_storage/blobs/redirect//test.jpg'
  }

  const mountComponent = (): VueWrapper => mount(SamplesEditView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期レンダリング', (): void => {
    describe('成功した場合', (): void => {
      it('表面処理情報の編集ページが表示されること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: mockResponse })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        // 見出し
        expect(wrapper.find('h3').text()).toBe('表面処理情報の編集')

        // フォーム要素
        expect(wrapper.find('form').exists()).toBe(true)

        // ラベル要素
        expect(wrapper.find('label[for="sample-name"]').text()).toContain('処理名')
        expect(wrapper.find('label[for="sample-color"]').text()).toContain('色')
        expect(wrapper.find('label[for="sample-hardness"]').text()).toContain('硬度')
        expect(wrapper.find('label[for="sample-film-thickness"]').text()).toContain('膜厚')
        expect(wrapper.find('label[for="sample-feature"]').text()).toContain('特徴')
        expect(wrapper.find('label[for="sample-summary"]').text()).toContain('概要')
        expect(wrapper.find('label[for="sample-image"]').text()).toContain('画像')

        // 入力要素
        expect(wrapper.find('#sample-name').exists()).toBe(true)
        expect(wrapper.find('#sample-color').exists()).toBe(true)
        expect(wrapper.find('#sample-hardness').exists()).toBe(true)
        expect(wrapper.find('#sample-film-thickness').exists()).toBe(true)
        expect(wrapper.find('#sample-feature').exists()).toBe(true)
        expect(wrapper.find('#sample-summary').exists()).toBe(true)

        // 入力要素の値
        const inputValue = (selector: string): string => {
          return (wrapper.find(selector).element as HTMLInputElement).value
        }

        expect(inputValue('#sample-name')).toBe('無電解ニッケルめっき')
        expect(inputValue('#sample-color')).toBe('ゴールド')
        expect(inputValue('#sample-hardness')).toBe('析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度')
        expect(inputValue('#sample-film-thickness')).toBe('通常は3～5μm、厚めの場合は20～50μmまで可能')
        expect(inputValue('#sample-feature')).toBe('耐食性・耐摩耗性・耐薬品性・耐熱性')
        expect(inputValue('#sample-summary')).toBe('電気を使わず化学反応で金属表面にニッケルを析出する技術です。')

        // 画像埋め込み要素
        expect(wrapper.find('#sample-image').attributes('src')).toContain('test.jpg')

        // ボタン要素
        const buttons = wrapper.findAll('button')
        expect(buttons[0].text()).toBe('更新')
        expect(buttons[1].text()).toBe('キャンセル')
      })
    })

    describe('失敗した場合', (): void => {
      it('404ページに遷移すること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockRejectedValueOnce({ response: { status: 404 } })

        vi.mocked(axios.isAxiosError).mockReturnValue(true)

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        const emittedMessage = wrapper.emitted('message') as Emit[] | undefined
        expect(emittedMessage).toBeTruthy()
        expect(emittedMessage![0][0]).toEqual(
          { type: 'danger', text: '表面処理情報の取得に失敗しました。' }
        )
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })

  describe('表面処理情報の更新', (): void => {
    describe('成功した場合', (): void => {
      it('成功メッセージが表示され、詳細ページに遷移すること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: mockResponse })

        vi.mocked(axios.patch).mockResolvedValueOnce({ data: mockResponse })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(axios.patch).toHaveBeenCalledWith(
          expect.stringContaining('/makers/1/samples/1'),
          expect.any(FormData),
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )

        const emittedMessage = wrapper.emitted('message') as Emit[] | undefined
        expect(emittedMessage).toBeTruthy()
        expect(emittedMessage![0][0]).toEqual(
          { type: 'success', text: '表面処理情報を更新しました。' }
        )

        expect(replaceMock).toHaveBeenCalledWith('/samples/1')
      })
    })

    describe('失敗した場合', (): void => {
      it('バリデーションエラーになること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: mockResponse })

        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.patch).mockRejectedValueOnce({ response: { status: 422 } })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(wrapper.find('.alert').text()).toBe('入力に不備があります。')
      })
    })
  })

  describe('キャンセルボタンを押した場合', (): void => {
    it('表面処理情報ページに遷移すること', async (): Promise<void> => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ data: mockResponse })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const cancelButton = wrapper.find('button[type="button"]')
      await cancelButton.trigger('click')
      await flushPromises()

      expect(replaceMock).toHaveBeenCalledWith('/samples/1')
    })
  })
})
