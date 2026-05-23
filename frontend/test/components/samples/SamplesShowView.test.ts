import SamplesShowView from '@/components/samples/SamplesShowView.vue'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import type { Sample, Comment, User, Emit } from '@/composables/samples/useSamplesShow.ts'
import axios from 'axios'

const { replaceMock, pushMock, backMock } = vi.hoisted(() => {
  return {
    replaceMock: vi.fn(),
    pushMock: vi.fn(),
    backMock: vi.fn()
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        params: { id: '1' }
      }
    },
    useRouter: () => {
      return {
        replace: replaceMock,
        push: pushMock,
        back: backMock
      }
    }
  }
})

describe('SamplesShowView', (): void => {
  const sampleResponse: Sample = {
    id: 1,
    name: '無電解ニッケルめっき',
    color: 'イエローブラウンシルバー',
    hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
    film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
    feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
    summary: '電気を使わず化学反応で金属表面にニッケルを析出する技術です。',
    maker_id: 1,
    category_id: 1,
    image_url: 'http://localhost:3000/rails/active_storage/blobs/sample_image_url.jpeg',
  }

  const commentResponse: Comment[] =[
    {
      id: 1,
      commenter: '岡本 陽子',
      body: '表面の質感が滑らかで、触感が良好です。',
      sample_id: 1,
      created_at: '2025-02-23T22:15:30.030Z',
      department: '営業部',
    }
  ]

  const adminUserResponse: User = {
    id: 49,
    name: 'admin user',
    department: '品質管理部',
    admin: true,
  }

  const generalUserResponse: User = {
    id: 50,
    name: 'general user',
    department: '開発部',
    admin: false,
  }

  const mountComponent = (): VueWrapper => mount(SamplesShowView, {
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
      it('表面処理情報ページが表示されること', async (): Promise<void> => {
        const adminUserId = 49

        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: { payload: { user_id: adminUserId } } })
          .mockResolvedValueOnce({ data: adminUserResponse })
          .mockResolvedValueOnce({ data: sampleResponse })
          .mockResolvedValueOnce({ data: commentResponse })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        // 見出し
        expect(wrapper.find('h3').text()).toBe('表面処理情報')

        // 処理名
        expect(wrapper.text()).toContain('無電解ニッケルめっき')

        // 色
        expect(wrapper.text()).toContain('イエローブラウンシルバー')

        // 硬度
        expect(wrapper.text()).toContain('HV550～HV700')

        // 膜厚
        expect(wrapper.text()).toContain('3～5μm')

        // 特徴
        expect(wrapper.text()).toContain('耐食性')

        // 概要
        expect(wrapper.text()).toContain('電気を使わず化学反応で金属表面にニッケルを析出する技術です。')

        // 画像
        expect(wrapper.find('img').attributes('src')).toContain('sample_image_url.jpeg')

        // コメントリストの見出し
        expect(wrapper.find('h5').text()).toBe('コメントリスト')

        // コメント
        expect(wrapper.find('#comment-department-commenter').text()).toMatch(/営業部：岡本 陽子/)
        expect(wrapper.find('#comment-created-at').text()).toMatch(/\d{4}\/\d{1,2}\/\d{1,2}/)
        expect(wrapper.find('#comment-body').text()).toBe('表面の質感が滑らかで、触感が良好です。')

        const commentLinks = wrapper.findAllComponents(RouterLinkStub)
        expect(commentLinks[0].props().to).toBe('/comments/1')

        // コメントの新規作成ボタン
        expect(wrapper.find('button').text()).toBe('コメントの新規作成')
        expect(wrapper.find('button').attributes('data-bs-toggle')).toBe('modal')

        // モーダル
        expect(wrapper.find('#commentPostForm').exists()).toBe(true)
        expect(wrapper.find('#commentPostFormLabel').text()).toBe('コメントの新規作成')
        expect(wrapper.find('#commenter').exists()).toBe(true)
        expect(wrapper.find('#department').exists()).toBe(true)
        expect(wrapper.find('#comment-post').exists()).toBe(true)

        const modalFooterButtons = wrapper.findAll('div[class="modal-footer"] button')
        expect(modalFooterButtons[0].text()).toBe('閉じる')
        expect(modalFooterButtons[1].text()).toBe('リストに追加')

        // 外部リンク
        const routerLinks = wrapper.findAllComponents(RouterLinkStub)

        expect(routerLinks[1].props().to).toBe('/samples/1/edit')
        expect(routerLinks[2].props().to).toBe('/samples')
        expect(routerLinks[1].text()).toBe('表面処理情報の編集')
        expect(routerLinks[2].text()).toBe('表面処理リストへ')

        // 表面処理の削除ボタン
        const deleteButton = wrapper.find('#handle-delete')
        expect(deleteButton.text()).toBe('表面処理情報の削除')
      })
    })

    describe('失敗した場合', (): void => {
      it('404ページに遷移すること', async (): Promise<void> => {
        const adminUserId = 49

        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: { payload: { user_id: adminUserId } } })
          .mockResolvedValueOnce({ data: adminUserResponse })
          .mockRejectedValueOnce({ response: { status: 404 } })

        vi.mocked(axios.isAxiosError).mockReturnValue(true)

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        const emittedMessage = wrapper.emitted<Emit>('message')
        expect(emittedMessage).toBeTruthy()
        expect(emittedMessage[0][0]).toEqual(
          { type: 'danger', text: '表面処理情報の取得に失敗しました。' }
        )
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })

  describe('表面処理の削除', (): void => {
    beforeEach((): void => {
      vi.stubGlobal('confirm', vi.fn(() => true))
    })

    afterEach((): void => {
      vi.unstubAllGlobals()
    })

    describe('成功した場合', (): void => {
      it('表面処理リストページに遷移する', async (): Promise<void> => {
        const adminUserId = 49

        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: { payload: { user_id: adminUserId } } })
          .mockResolvedValueOnce({ data: adminUserResponse })
          .mockResolvedValueOnce({ data: sampleResponse })
          .mockResolvedValueOnce({ data: commentResponse })

        vi.mocked(axios.delete).mockResolvedValueOnce({ status: 204 })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        const deleteButton = wrapper.find('#handle-delete')
        await deleteButton.trigger('click')

        const emittedMessage = wrapper.emitted<Emit>('message')
        expect(emittedMessage).toBeTruthy()
        expect(emittedMessage[0][0]).toEqual(
          { type: 'success', text: '表面処理情報を削除しました。' }
        )
        expect(pushMock).toHaveBeenCalledWith('/samples')
      })
    })

    describe('失敗した場合', (): void => {
      it('404ページに遷移すること', async (): Promise<void> => {
        const adminUserId = 49

        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: { payload: { user_id: adminUserId } } })
          .mockResolvedValueOnce({ data: adminUserResponse })
          .mockResolvedValueOnce({ data: sampleResponse })
          .mockResolvedValueOnce({ data: commentResponse })

        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.delete).mockRejectedValue({ response: { status: 404 } })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        const deleteButton = wrapper.find('#handle-delete')
        await deleteButton.trigger('click')

        const emittedMessage = wrapper.emitted<Emit>('message')
        expect(emittedMessage).toBeTruthy()
        expect(emittedMessage[0][0]).toEqual(
          { type: 'danger', text: '表面処理情報の削除処理に失敗しました。' }
        )
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })

  describe('コメントの新規作成', (): void => {
    describe('コメントの新規作成に成功した場合', (): void => {
      it('コメントリストに追加されること', async (): Promise<void> => {
        const adminUserId = 49

        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: { payload: { user_id: adminUserId } } })
          .mockResolvedValueOnce({ data: adminUserResponse })
          .mockResolvedValueOnce({ data: sampleResponse })
          .mockResolvedValueOnce({
            data: [
              {
                id: 1,
                commenter: '佐藤 太郎',
                body: 'このめっきの膜厚は均一です。',
                sample_id: 1,
                created_at: '2025-02-23T22:15:30.030Z',
                department: '営業部',
              }
            ]
          })

        vi.mocked(axios.post).mockResolvedValueOnce({
          data: {
            id: 1,
            commenter: '佐藤 太郎',
            body: 'このめっきの膜厚は均一です。',
            sample_id: 1,
            created_at: '2025-02-23T22:15:30.030Z',
            department: '営業部',
          }
        })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        const modalFooterButtons = wrapper.findAll('div[class="modal-footer"] button')
        const addToListButton = modalFooterButtons[1]

        await addToListButton.trigger('click')

        expect(axios.post).toHaveBeenCalled()
        expect(wrapper.html()).toContain('営業部：佐藤 太郎')
        expect(wrapper.html()).toMatch(/\d{4}\/\d{1,2}\/\d{1,2}/)
        expect(wrapper.html()).toContain('このめっきの膜厚は均一です。')
      })
    })

    describe('コメントの新規作成に失敗した場合', (): void => {
      it('コメント入力を促すメッセージが表示されること', async (): Promise<void> => {
        const adminUserId = 49

        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: { payload: { user_id: adminUserId } } })
          .mockResolvedValueOnce({ data: adminUserResponse })
          .mockResolvedValueOnce({ data: sampleResponse })
          .mockResolvedValueOnce({ data: commentResponse })

        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.post).mockRejectedValueOnce({ response: { status: 422 } })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        const modalFooterButtons = wrapper.findAll('div[class="modal-footer"] button')
        const addToListButton = modalFooterButtons[1]

        await addToListButton.trigger('click')

        expect(wrapper.find('div.text-danger.ms-3').text()).toBe('入力に不備があります。')
      })
    })
  })

  describe('一般ユーザーでログインした場合', (): void => {
    it('各種リンクの表示・非表示が正常であること', async (): Promise<void> => {
      const generalUserId = 50

      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ data: { payload: { user_id: generalUserId } } })
        .mockResolvedValueOnce({ data: generalUserResponse })
        .mockResolvedValueOnce({ data: sampleResponse })
        .mockResolvedValueOnce({ data: commentResponse })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      // 検索結果に戻るボタン (リンク)
      const goBackButton = wrapper.findAll('ul li')
      expect(goBackButton[0].text()).toBe('検索結果に戻る')

      // 表面処理情報の削除ボタン (リンク)
      const removeButton = wrapper.find('#handle-delete')
      expect(removeButton.attributes('style')).toBe('display: none;')

      // 表面処理リストへのリンク (非表示)
      const liElements = wrapper.findAll('ul li')
      expect(liElements[2].attributes('style')).toBe('display: none;')
    })
  })

  describe('検索結果に戻るボタン（リンク）を押した場合', (): void => {
    it('router.back()が呼び出されること', async (): Promise<void> => {
      const generalUserId = 50

      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ data: { payload: { user_id: generalUserId } } })
        .mockResolvedValueOnce({ data: generalUserResponse })
        .mockResolvedValueOnce({ data: sampleResponse })
        .mockResolvedValueOnce({ data: commentResponse })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const goBackButton = wrapper.find('ul li button')
      expect(goBackButton.exists()).toBe(true)

      await goBackButton.trigger('click')

      expect(backMock).toHaveBeenCalledTimes(1)
    })
  })
})
