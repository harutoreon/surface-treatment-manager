import CommentsNewView from '@/components/comments/CommentsNewView.vue'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import type { Maker, User, SampleResponse, Comment, Emit } from '@/composables/comments/useCommentsNew.ts'
import type { VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
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
        push: pushMock
      }
    }
  }
})

describe('CommentsNewView', (): void => {
  const mockMakerResponse: Maker[] = [
    {
      id: 1,
      name: '東亜電化工業株式会社'
    }
  ]

  const mockUserResponse: User[] = [
    {
      id: 1,
      name: '岩崎 颯太',
      department: '品質管理部',
      admin: false,
    }
  ]

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

  const mockCommentResponse: Comment = {
    id: 1,
    commenter: '岩崎 颯太',
    department: '品質管理部',
    body: '耐久性が高く、長期間の使用に耐えられる仕上がりです。',
    sample_id: 1,
    user_id: 1,
  }

  const mountComponent = (): VueWrapper => mount(CommentsNewView, {
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
      it('コメント情報の新規登録ページが表示されること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ data: { status: 200 } })
          .mockResolvedValueOnce({ data: mockMakerResponse })
          .mockResolvedValueOnce({ data: mockUserResponse })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        // 見出し
        expect(wrapper.find('h3').text()).toBe('コメント情報の新規登録')

        // フォーム要素
        expect(wrapper.find('form').exists()).toBe(true)

        // ラベル要素
        expect(wrapper.find('label[for="commenter"]').text()).toBe('投稿者')
        expect(wrapper.find('label[for="departments"]').text()).toBe('部署名')
        expect(wrapper.find('label[for="makers"]').text()).toBe('メーカー')
        expect(wrapper.find('label[for="body"]').text()).toBe('コメント')

        // 入力要素
        expect(wrapper.find('#commenter').exists()).toBe(true)
        expect(wrapper.find('#department').exists()).toBe(true)

        // メーカーの選択要素
        const makerSelect = wrapper.find('#makers')
        const makerSelectOptions = makerSelect.findAll('option')
        expect(makerSelect.exists()).toBe(true)
        expect(makerSelectOptions[0].text()).toBe('メーカーを選択して下さい')
        expect(makerSelectOptions[1].text()).toBe('東亜電化工業株式会社')

        // テキストエリア要素
        expect(wrapper.find('#body').exists()).toBe(true)

        // ボタン要素
        expect(wrapper.find('button').text()).toBe('登録')

        // ナビゲーションリンク
        const routerLink = wrapper.findComponent(RouterLinkStub)
        expect(routerLink.props().to).toBe('/comments')
        expect(routerLink.text()).toBe('コメントリストへ')
      })
    })

    describe('失敗した場合', (): void => {
      it('エラーメッセージが表示され、ログインページに遷移すること', async (): Promise<void> => {
        vi.mocked(axios.get).mockRejectedValue({ response: { status: 401 } })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        const emittedMessage = wrapper.emitted<Emit>('message')
        expect(emittedMessage).toBeTruthy()
        expect(emittedMessage![0][0]).toEqual(
          { type: 'danger', text: 'ログインが必要です。' }
        )
        expect(pushMock).toHaveBeenCalledWith('/')
      })
    })
  })

  describe('投稿者と部署名の連動', (): void => {
    describe('投稿者の候補がある場合', (): void => {
      beforeEach(() => {
        vi.useFakeTimers()
      })

      afterEach(() => {
        vi.useRealTimers()
      })

      it('投稿者名の一部を入力すると候補が表示され、投稿者を選択後に部署名が表示されること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ data: { status: 200 } })
          .mockResolvedValueOnce({ data: mockMakerResponse })
          .mockResolvedValueOnce({ data: mockUserResponse })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        const input = wrapper.find('#commenter')
        await input.trigger('focus')
        await input.setValue(mockUserResponse[0].name.slice(0,2))  // 「岩崎 颯太」の一部の「岩崎」を入力

        const li = wrapper.find('form ul li')
        expect(li.text()).toBe(mockUserResponse[0].name)

        await input.trigger('blur')
        await li.trigger('mousedown')

        vi.runAllTimers()
        await nextTick()

        expect((wrapper.find('#department').element as HTMLInputElement).value).toBe(mockUserResponse[0].department)
      })
    })

    describe('投稿者の候補がない場合', (): void => {
      it('投稿者名の一部を入力しても投稿者の候補が表示されず、部署名も表示されないこと', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ data: { status: 200 } })
          .mockResolvedValueOnce({ data: mockMakerResponse })
          .mockResolvedValueOnce({ data: [] })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        const input = wrapper.find('#commenter')
        await input.trigger('focus')
        await input.setValue(mockUserResponse[0].name.slice(0,2))  // 「岩崎 颯太」の一部の「岩崎」を入力

        expect(wrapper.find('form ul li').exists()).toBe(false)
        expect((wrapper.find('#department').element as HTMLInputElement).value).toBe('')
      })
    })
  })

  describe('メーカーと表面処理の連動', (): void => {
    describe('メーカーの候補がある場合', (): void => {
      it('メーカーが選択可能になり、メーカーを選択後に表面処理の候補が表示されること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ data: { status: 200 } })
          .mockResolvedValueOnce({ data: mockMakerResponse })
          .mockResolvedValueOnce({ data: mockUserResponse })
          .mockResolvedValueOnce({ data: mockSampleResponse })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('#makers').setValue(mockMakerResponse[0].name)

        expect(wrapper.find('#samples').exists()).toBe(true)
        expect(wrapper.findAll('#samples option')[1].text()).toBe(mockSampleResponse.samples[0].name)
      })
    })

    describe('メーカーの候補が無い場合', (): void => {
      it('ドロップダウンリストのオプションがデフォルトのみで、表面処理のドロップダウンリストも表示されないこと', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ data: { status: 200 } })
          .mockResolvedValueOnce({ data: [] })
          .mockResolvedValueOnce({ data: mockUserResponse })
          .mockResolvedValueOnce({ data: mockSampleResponse })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        expect(wrapper.findAll('#makers option').length).toBe(1)
        expect(wrapper.findAll('#makers option')[0].text()).toBe('メーカーを選択して下さい')
        expect(wrapper.find('#samples').exists()).toBe(false)
      })
    })
  })

  describe('コメントの新規登録', (): void => {
    describe('成功した場合', (): void => {
      it('成功メッセージが表示され、コメント情報ページに遷移すること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ data: { status: 200 } })
          .mockResolvedValueOnce({ data: mockMakerResponse })
          .mockResolvedValueOnce({ data: mockUserResponse })
          .mockResolvedValueOnce({ data: mockSampleResponse })

        vi.mocked(axios.post).mockResolvedValueOnce({ data: mockCommentResponse })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('form').trigger('submit.prevent')

        const emittedMessage = wrapper.emitted<Emit>('message')
        expect(emittedMessage).toBeTruthy()
        expect(emittedMessage![0][0]).toEqual(
          { type: 'success', text: 'コメント情報を1件登録しました。' }
        )
        expect(pushMock).toHaveBeenCalledWith('/comments/1')
      })
    })

    describe('失敗した場合', (): void => {
      it('バリデーションエラーになること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ data: { status: 200 } })
          .mockResolvedValueOnce({ data: mockMakerResponse })
          .mockResolvedValueOnce({ data: mockUserResponse })
          .mockResolvedValueOnce({ data: mockSampleResponse })

        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.post).mockRejectedValueOnce({ response: { status: 422 } })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('form').trigger('submit.prevent')

        expect(wrapper.find('.alert').text()).toBe('入力に不備があります。')
      })
    })
  })
})
