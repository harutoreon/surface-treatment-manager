import CategoriesIndexView from '@/components/categories/CategoriesIndexView.vue'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import type { MessageEmit } from '@/env'
import type { Category } from '@/composables/categories/useCategoriesIndex'
import axios from 'axios'

const { replaceMock, requireLoginMock } = vi.hoisted(() => {
  return {
    replaceMock: vi.fn(),
    requireLoginMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        replace: replaceMock,
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

describe('CategoriesIndexView', (): void => {
  const mockResponse: Category[] = [
    {
      id: 1,
      item: 'めっき',
      summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
    }
  ]

  const mountComponent = () => mount(CategoriesIndexView, {
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

  describe('カテゴリーリストの取得に成功した場合', (): void => {
    it('カテゴリーリストページが表示されること', async (): Promise<void> => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockResponse })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      // 見出し
      expect(wrapper.find('h3').text()).toBe('カテゴリーリスト')

      // ラベル
      expect(wrapper.text()).toContain('めっき')

      // 概要文
      expect(wrapper.text()).toContain('金属または非金属の材...')

      // 外部リンク
      const routerLinks = wrapper.find('ul').findAllComponents(RouterLinkStub)
      const newLink = routerLinks.find(element => element.props().to === '/categories/new')
      const homeLink = routerLinks.find(element => element.props().to === '/home')

      expect(newLink.text()).toBe('カテゴリー情報の登録')
      expect(homeLink.text()).toBe('メインメニューへ')
    })
  })

  describe('カテゴリーリストの取得に失敗した場合', (): void => {
    it('エラーメッセージを emit して NotFound ルートに遷移する', async (): Promise<void> => {
      vi.mocked(axios.isAxiosError).mockReturnValue(true)
      vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 404 } })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const emittedMessage = wrapper.emitted<MessageEmit>('message')
      expect(emittedMessage[0]?.[0]).toEqual(
        { type: 'danger', text: 'カテゴリーの取得に失敗しました。' }
      )
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })
})
