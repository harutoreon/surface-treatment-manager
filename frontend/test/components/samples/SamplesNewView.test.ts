import SamplesNewView from '@/components/samples/SamplesNewView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import type { Category, Maker, Emit } from '@/composables/samples/useSamplesNew.ts'
import axios from 'axios'

interface MockFileReader {
  result: string | null
  onload: ((event: { target: MockFileReader }) => void)
}

const { pushMock, replaceMock } = vi.hoisted(() => {
  return {
    pushMock: vi.fn(),
    replaceMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock,
        replace: replaceMock,
      }
    }
  }
})

describe('SamplesNewView', (): void => {
  const categoryOptionsResponse: Category[] = [
    {
      id: 1,
      item: 'めっき',
      summary: 'test summary'
    }
  ]

  const makerOptionsResponse: Maker[] = [
    {
      id: 1,
      name: '東亜電化工業株式会社'
    }
  ]

  const mountComponent = (): VueWrapper => mount(SamplesNewView, {
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
      it('表面処理情報の登録ページが表示されること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: categoryOptionsResponse })
          .mockResolvedValueOnce({ data: makerOptionsResponse })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        // 見出し
        expect(wrapper.find('h3').text()).toBe('表面処理情報の登録')

        // フォーム要素
        expect(wrapper.find('form').exists()).toBe(true)

        // ラベル要素
        expect(wrapper.find('label[for="sample-name"]').text()).toBe('処理名')
        expect(wrapper.find('label[for="sample-category"]').text()).toBe('カテゴリー')
        expect(wrapper.find('label[for="sample-color"]').text()).toBe('色')
        expect(wrapper.find('label[for="makers"]').text()).toBe('メーカー')
        expect(wrapper.find('label[for="sample-hardness"]').text()).toBe('硬度')
        expect(wrapper.find('label[for="sample-film-thickness"]').text()).toBe('膜厚')
        expect(wrapper.find('label[for="sample-feature"]').text()).toBe('特徴')
        expect(wrapper.find('label[for="sample-summary"]').text()).toBe('概要')
        expect(wrapper.find('label[for="sample-image"]').text()).toBe('画像')

        // 入力要素（テキスト）
        expect(wrapper.find('#sample-name').exists()).toBe(true)
        expect(wrapper.find('#sample-color').exists()).toBe(true)
        expect(wrapper.find('#sample-hardness').exists()).toBe(true)
        expect(wrapper.find('#sample-film-thickness').exists()).toBe(true)
        expect(wrapper.find('#sample-feature').exists()).toBe(true)
        expect(wrapper.find('#sample-summary').exists()).toBe(true)

        // 選択要素
        expect(wrapper.find('#sample-category').exists()).toBe(true)
        expect(wrapper.find('option[value=""]').text()).toBe('カテゴリーを選択して下さい')
        expect(wrapper.find('option[value="めっき"]').text()).toBe('めっき')

        const makerSelect = wrapper.find('#makers')
        const makerSelectOptions = makerSelect.findAll('option')

        expect(makerSelect.exists()).toBe(true)
        expect(makerSelectOptions[0].text()).toBe('メーカーを選択して下さい')
        expect(makerSelectOptions[1].text()).toBe('東亜電化工業株式会社')

        // 入力要素（ファイル）
        expect(wrapper.find('#sample-image').exists()).toBe(true)

        // ボタン要素
        expect(wrapper.find('button').text()).toBe('登録')

        // 外部リンク
        const routerLink = wrapper.findComponent(RouterLinkStub)
        expect(routerLink.props().to).toBe('/samples')
        expect(routerLink.text()).toBe('表面処理リストへ')
      })
    })

    describe('失敗した場合', (): void => {
      it('ログインページに遷移すること', async (): Promise<void> => {
        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.get).mockRejectedValue({ response: { status: 401 } })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        const emittedMessage = wrapper.emitted<Emit>('message')
        expect(emittedMessage).toBeTruthy()
        expect(emittedMessage[0][0]).toEqual(
          { type: 'danger', text: 'ログインが必要です。' }
        )
        expect(pushMock).toHaveBeenCalledWith('/')
      })
    })
  })

  describe('表面処理情報の新規登録', (): void => {
    describe('成功した場合', (): void => {
      it('登録成功のメッセージが表示され、詳細ページに遷移すること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: categoryOptionsResponse })
          .mockResolvedValueOnce({ data: makerOptionsResponse })

        vi.mocked(axios.post).mockResolvedValue({
          data: {
            id: 1,
            name: '無電解ニッケルめっき',
            category: 'めっき',
            color: 'イエローブラウンシルバー',
            maker: '東亜電化工業株式会社',
            hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
            film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
            feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
            summary: '電気を使わず化学反応で金属表面にニッケルを析出する技術です。',
            image_url: 'http://localhost:3000/electroless_nickel_plating.jpeg',
            category_id: 1,
          }
        })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('#sample-name').setValue('無電解ニッケルめっき')
        await wrapper.find('#sample-category').setValue('めっき')
        await wrapper.find('#sample-color').setValue('イエローブラウンシルバー')
        await wrapper.find('#makers').setValue('東亜電化工業株式会社')
        await wrapper.find('#sample-hardness').setValue('析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度')
        await wrapper.find('#sample-film-thickness').setValue('通常は3～5μm、厚めの場合は20～50μmまで可能')
        await wrapper.find('#sample-feature').setValue('耐食性・耐摩耗性・耐薬品性・耐熱性')
        await wrapper.find('#sample-summary').setValue('電気を使わず化学反応で金属表面にニッケルを析出する技術です。')

        await wrapper.find('form').trigger('submit.prevent')

        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/makers/1/samples'),
          expect.any(FormData),
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )

        const emittedMessage = wrapper.emitted<Emit>('message')
        expect(emittedMessage).toBeTruthy()
        expect(emittedMessage[0][0]).toEqual(
          { type: 'success', text: '表面処理情報を1件登録しました。' }
        )

        expect(pushMock).toHaveBeenCalledWith('/samples/1')
      })
    })

    describe('失敗した場合', (): void => {
      it('バリデーションエラーになること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: categoryOptionsResponse })
          .mockResolvedValueOnce({ data: makerOptionsResponse })

        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.post).mockRejectedValue({ response: { status: 422 } })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('#sample-name').setValue('')
        await wrapper.find('#sample-category').setValue('めっき')
        await wrapper.find('#sample-color').setValue('イエローブラウンシルバー')
        await wrapper.find('#makers').setValue('東亜電化工業株式会社')
        await wrapper.find('#sample-hardness').setValue('析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度')
        await wrapper.find('#sample-film-thickness').setValue('通常は3～5μm、厚めの場合は20～50μmまで可能')
        await wrapper.find('#sample-feature').setValue('耐食性・耐摩耗性・耐薬品性・耐熱性')
        await wrapper.find('#sample-summary').setValue('電気を使わず化学反応で金属表面にニッケルを析出する技術です。')

        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(wrapper.find('.alert').text()).toBe('入力に不備があります。')
      })
    })
  })

  describe('画像アップロード', (): void => {
    const attachImageMountComponent = (): VueWrapper => mount(SamplesNewView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      },
      attachTo: document.body
    })

    describe('ファイルの容量が5MB未満の場合', (): void => {
      it('プレビューが表示されること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: categoryOptionsResponse })
          .mockResolvedValueOnce({ data: makerOptionsResponse })

        const wrapper: VueWrapper = attachImageMountComponent()
        await flushPromises()

        const file = new File(['a'.repeat(4_000_000)], 'small.jpg', { type: 'image/jpeg' })
        const inputEl = wrapper.find('#sample-image').element

        const mockReadAsDataURL = vi.fn(function (this: MockFileReader) {
          this.result = 'data:image/jpeg;base64,preview'
          this.onload?.({ target: this })
        })

        vi.stubGlobal('FileReader', class {
          onload: MockFileReader['onload'] = null
          readAsDataURL = mockReadAsDataURL
        })

        Object.defineProperty(inputEl, 'files', { value: [file], writable: false })
        inputEl.dispatchEvent(new Event('change'))

        await flushPromises()

        expect(wrapper.find('#preview-image').attributes('src')).toBe('data:image/jpeg;base64,preview')
      })
    })

    describe('ファイルの容量が5MBを超える場合', (): void => {
      it('エラーメッセージを表示してプレビューが表示されないこと', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: categoryOptionsResponse })
          .mockResolvedValueOnce({ data: makerOptionsResponse })

        const wrapper: VueWrapper = attachImageMountComponent()
        await flushPromises()

        const file = new File(['a'.repeat(6_000_000)], 'large.jpg', { type: 'image/jpeg' })
        const inputEl = wrapper.find('#sample-image').element

        Object.defineProperty(inputEl, 'files', { value: [file], writable: false })
        inputEl.dispatchEvent(new Event('change'))

        await flushPromises()

        expect(wrapper.text()).toContain('5MB未満のファイルに変更して下さい。')
        expect(wrapper.find('#preview-image').exists()).toBe(false)
      })
    })
  })
})
