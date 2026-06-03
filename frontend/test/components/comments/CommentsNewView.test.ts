import CommentsNewView from '@/components/comments/CommentsNewView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub,  } from '@vue/test-utils'
import type { Maker, User, Emit } from '@/composables/comments/useCommentsNew.ts'
import type { VueWrapper } from '@vue/test-utils'
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

// 投稿者と部署名の連動
// ・投稿者の候補がある場合
//   ・投稿者の候補が表示され、選択後に部署名が表示されること
// ・投稿者の候補がない場合
//   ・投稿者の候補が表示されず、部署名も表示されないこと
// メーカーと表面処理の連動
// ・メーカーの候補がある場合
//   ・メーカーが選択可能になり、選択後に表面処理のドロップダウンリストが表示されること
// ・メーカーの候補が無い場合
//   ・ドロップダウンリストのオプションがデフォルトのみであること
// コメントの新規登録
// ・成功した場合
//   ・成功メッセージが表示され、コメント情報ページに遷移すること
// ・失敗した場合
//   ・バリデーションエラーになること

})
