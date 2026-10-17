import CategoriesNewView from '@/components/categories/CategoriesNewView.vue'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { checkLoginStatus } from '@/components/utils.ts'
import type { MessageEmit } from '@/env'
import axios from 'axios'

const { pushMock } = vi.hoisted(() => {
  return {
    pushMock: vi.fn(),
  }
})

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
vi.mock('@/components/utils', () => {
  return {
    checkLoginStatus: vi.fn()
  }
})

describe('CategoriesNewView', (): void => {
  const mockResponse = {
    id: 1,
    item: 'めっき',
    summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
  }

  const mountComponent = () => mount(CategoriesNewView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  beforeEach((): void => {
    vi.resetAllMocks()
  })

  describe('初期レンダリングに成功した場合', (): void => {
    it('カテゴリー情報の登録ページが表示されること', async (): Promise<void> => {
      vi.mocked(checkLoginStatus).mockResolvedValue(true)

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      // 見出し
      expect(wrapper.find('h3').text()).toBe('カテゴリー情報の登録')

      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      expect(wrapper.find('label[for="category-item"]').text()).toBe('カテゴリー名')
      expect(wrapper.find('label[for="category-summary"]').text()).toBe('概要')

      // 入力要素・テキストエリア要素
      expect(wrapper.find('#category-item').exists()).toBe(true)
      expect(wrapper.find('#category-summary').exists()).toBe(true)

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('登録')

      // 外部リンク
      const routerLink = wrapper.findComponent(RouterLinkStub)
      expect(routerLink.props().to).toBe('/categories')
      expect(routerLink.text()).toBe('カテゴリーリストへ')
    })
  })

  describe('初期レンダリングに失敗した場合', (): void => {
    it('ログインページに遷移すること', async (): Promise<void> => {
      vi.mocked(checkLoginStatus).mockImplementation(async (onUnauthorized) => {
        onUnauthorized?.()
        return false
      })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const emittedMessage = wrapper.emitted<MessageEmit>('message')
      expect(emittedMessage[0]?.[0]).toEqual(
        { type: 'danger', text: 'ログインが必要です。' }
      )
      expect(pushMock).toHaveBeenCalledWith('/')
    })
  })

  describe('有効な情報を送信した場合', (): void => {
    it('登録に成功すること', async (): Promise<void> => {
      vi.mocked(checkLoginStatus).mockResolvedValue(true)
      vi.mocked(axios.post).mockResolvedValueOnce({ data: mockResponse })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      await wrapper.find('#category-item').setValue('めっき')
      await wrapper.find('#category-summary').setValue(
        '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
      )

      await wrapper.find('form').trigger('submit')
      await flushPromises()

      const emittedMessage = wrapper.emitted<MessageEmit>('message')
      expect(emittedMessage[0]?.[0]).toEqual(
        { type: 'success', text: 'カテゴリーを1件登録しました。' }
      )
      expect(pushMock).toHaveBeenCalledWith('/categories/1')
    })
  })

  describe('無効な情報を送信した場合', (): void => {
    it('登録に失敗すること', async (): Promise<void> => {
      vi.mocked(checkLoginStatus).mockResolvedValue(true)
      vi.mocked(axios.isAxiosError).mockReturnValue(true)
      vi.mocked(axios.post).mockRejectedValueOnce({ response: { status: 422 } })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      await wrapper.find('#category-item').setValue('')
      await wrapper.find('#category-summary').setValue(
        '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
      )

      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(wrapper.find('.alert').text()).toBe('入力に不備があります。')
    })
  })
})
