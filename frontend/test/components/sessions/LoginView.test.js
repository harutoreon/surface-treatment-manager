import LoginView from '@/components/sessions/LoginView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import axios from 'axios'

const pushMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock
      }
    }
  }
})

describe('LoginForm', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = mount(LoginView)
    await flushPromises()
  })

  describe('ログインフロー', () => {
    it('ログインに成功時、ホーム画面へ遷移し、メッセージを通知すること', async () => {
      axios.post.mockResolvedValue({ data: { token: 'fake-token' } })

      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()

      expect(pushMock).toHaveBeenCalledWith('/home')
      expect(wrapper.emitted('message')).toBeTruthy()
      expect(wrapper.emitted('message')).toHaveLength(1)
    })

    it('ログイン失敗時、エラー表示が出ること', async () => {
      axios.post.mockRejectedValue(new Error())

      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()

      expect(wrapper.find('p.alert-danger').exists()).toBe(true)
    })
  })

  describe('ユーザーの選択', () => {
    it('一般ユーザーを選択した場合、フォームの値が更新されること', async () => {
      expect(wrapper.find('#user-name').element.value).toBe('')

      await wrapper.find('#general-user').trigger('change')

      expect(wrapper.find('#user-name').element.value).not.toBe('')
      expect(wrapper.find('#user-password').element.value).not.toBe('')
    })

    it('管理者ユーザーを選択した場合、フォームの値が更新されること', async () => {
      expect(wrapper.find('#user-name').element.value).toBe('')

      await wrapper.find('#admin-user').trigger('change')

      expect(wrapper.find('#user-name').element.value).not.toBe('')
      expect(wrapper.find('#user-password').element.value).not.toBe('')
    })
  })
})
