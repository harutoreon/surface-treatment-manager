import UsersEditView from '@/components/users/UsersEditView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import type { MessageEmit } from '@/env'
import type { UserResponse } from '@/composables/users/useUsersShow'
import axios from 'axios'

const { replaceMock, pushMock, requireLoginMock } = vi.hoisted(() => {
  return {
    replaceMock: vi.fn(),
    pushMock: vi.fn(),
    requireLoginMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        params: { id: '1' },
      }
    },
    useRouter: () => {
      return {
        replace: replaceMock,
        push: pushMock
      }
    }
  }
})
vi.mock('@/composables/auth/useAuthGuard', () => {
  return {
    useAuthGuard: () => {
      return {
        requireLogin: requireLoginMock,
      }
    }
  }
})

describe('UsersEditView', (): void => {
  const mockGetResponse: UserResponse = {
    id: 1,
    name: '渡辺 陸斗',
    department: '開発部',
    admin: false
  }

  const mockPostResponse: UserResponse = {
    id: 1,
    name: '伊藤 美月',
    department: '開発部',
    admin: false
  }

  const mountComponent = () => mount(UsersEditView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  beforeEach((): void => {
    vi.resetAllMocks()
    requireLoginMock.mockResolvedValue(true)
  })

  describe('初期レンダリングに成功した場合', (): void => {
    it('ユーザー情報の編集ページが表示されること', async (): Promise<void> => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockGetResponse })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      // 見出し
      expect(wrapper.find('h3').text()).toBe('ユーザー情報の編集')

      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      expect(wrapper.find('label[for="user-name"]').text()).toBe('ユーザー名')
      expect(wrapper.find('label[for="user-department"]').text()).toBe('部署名')
      expect(wrapper.find('label[for="user-password"]').text()).toBe('パスワード')
      expect(wrapper.find('label[for="user-password-confirmation"]').text()).toBe('パスワードの確認')

      // 入力要素
      const userName = wrapper.find('#user-name').element as HTMLInputElement
      expect(userName.value).toBe('渡辺 陸斗')
      const departmentName = wrapper.find('#user-department').element as HTMLInputElement
      expect(departmentName.value).toBe('開発部')
      expect(wrapper.find('#user-password').exists()).toBe(true)
      expect(wrapper.find('#user-password-confirmation').exists()).toBe(true)

      // ボタン要素
      const buttons = wrapper.findAll('button')
      expect(buttons[0].text()).toBe('更新')
      expect(buttons[1].text()).toBe('キャンセル')
    })
  })

  describe('初期レンダリングに失敗した場合', (): void => {
    it('404ページに遷移すること', async (): Promise<void> => {
      vi.mocked(axios.isAxiosError).mockReturnValue(true)
      vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 404 } })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const emittedMessage = wrapper.emitted<MessageEmit>('message')
      expect(emittedMessage).toHaveLength(1)
      expect(emittedMessage?.[0][0]).toEqual(
        { type: 'danger', text: 'ユーザー情報の取得に失敗しました。' }
      )
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('ユーザー情報の更新に成功した場合', (): void => {
    it('ユーザー情報ページに遷移すること', async (): Promise<void> => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockGetResponse })
      vi.mocked(axios.patch).mockResolvedValueOnce({ data: mockPostResponse })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      await wrapper.find('#user-name').setValue('update test user')
      await wrapper.find('button').trigger('submit')
      await flushPromises()

      const emittedMessage = wrapper.emitted<MessageEmit>('message')
      expect(emittedMessage).toHaveLength(1)
      expect(emittedMessage?.[0][0]).toEqual(
        { type: 'success', text: 'ユーザー情報を更新しました。' }
      )
      expect(pushMock).toHaveBeenCalledWith('/users/1')
    })
  })

  describe('ユーザー情報の更新に失敗した場合', (): void => {
    it('入力不備のメッセージが表示されること', async (): Promise<void> => {
      vi.mocked(axios.isAxiosError).mockReturnValue(true)
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockGetResponse })
      vi.mocked(axios.patch).mockRejectedValueOnce({ response: { status: 422 } })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      await wrapper.find('#user-name').setValue('')
      await wrapper.find('button').trigger('submit')
      await flushPromises()
      
      expect(wrapper.find('.alert').text()).toBe('入力に不備があります。')
    })
  })

  describe('キャンセルボタンを押した場合', (): void => {
    it('ユーザー情報ページに移動すること', async (): Promise<void> => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockGetResponse })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const cancelButton = wrapper.find('button[type="button"]')
      await cancelButton.trigger('click')
      await flushPromises()

      expect(pushMock).toHaveBeenCalledWith('/users/1')
    })
  })
})
