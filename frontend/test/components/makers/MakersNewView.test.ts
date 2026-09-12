import MakersNewView from '@/components/makers/MakersNewView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import type { Maker } from '@/composables/makers/useMakers'
import type { MessageEmit } from '@/env'
import axios from 'axios'

const { requireLoginMock, pushMock } = vi.hoisted(() => {
  return {
    requireLoginMock: vi.fn(),
    pushMock: vi.fn()
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        query: { page: {} }
      }
    },
    useRouter: () => {
      return {
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

describe('MakersNewView', () => {
  const mockResponse: Maker = {
    id: 1,
    address: '東京都渋谷区神南1-2-0',
    email: 'sample_maker0@example.com',
    fax_number: '070-2623-8399',
    home_page: 'https://example.com/sample_maker0',
    manufacturer_rep: '宮本 悠斗',
    name: '有限会社中野銀行',
    phone_number: '070-3288-2552',
    postal_code: '962-0713',
  }

  const mountComponent = () => mount(MakersNewView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  beforeEach((): void => {
    vi.clearAllMocks()
    requireLoginMock.mockResolvedValue(true)
  })

  describe('初期レンダリング', (): void => {
    describe('成功した場合', (): void => {
      it('メーカー情報の登録ページが表示されること', async (): Promise<void> => {
        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        // 見出し
        expect(wrapper.find('h3').text()).toBe('メーカー情報の登録')

        // フォーム要素
        expect(wrapper.find('form').exists()).toBe(true)

        // ラベル要素
        expect(wrapper.find('label[for="maker-name"]').text()).toBe('メーカー名')
        expect(wrapper.find('label[for="maker-postal-code"]').text()).toBe('郵便番号')
        expect(wrapper.find('label[for="maker-address"]').text()).toBe('住所')
        expect(wrapper.find('label[for="maker-phone-number"]').text()).toBe('電話番号')
        expect(wrapper.find('label[for="maker-fax-number"]').text()).toBe('FAX番号')
        expect(wrapper.find('label[for="maker-email"]').text()).toBe('Email')
        expect(wrapper.find('label[for="maker-home-page"]').text()).toBe('ホームページ')
        expect(wrapper.find('label[for="maker-manufacturer-rep"]').text()).toBe('担当者')

        // 入力要素
        expect(wrapper.find('#maker-name').exists()).toBe(true)
        expect(wrapper.find('#maker-postal-code').exists()).toBe(true)
        expect(wrapper.find('#maker-address').exists()).toBe(true)
        expect(wrapper.find('#maker-phone-number').exists()).toBe(true)
        expect(wrapper.find('#maker-fax-number').exists()).toBe(true)
        expect(wrapper.find('#maker-email').exists()).toBe(true)
        expect(wrapper.find('#maker-home-page').exists()).toBe(true)
        expect(wrapper.find('#maker-manufacturer-rep').exists()).toBe(true)

        // ボタン要素
        expect(wrapper.find('button').text()).toBe('登録')

        // 外部リンク
        const routerLink = wrapper.findComponent(RouterLinkStub)
        expect(routerLink.props().to).toBe('/makers')
        expect(routerLink.text()).toBe('メーカーリストへ')
      })
    })
  })

  describe('メーカー登録', (): void => {
    describe('成功した場合', (): void => {
      it('登録に成功して詳細ページに遷移すること', async (): Promise<void> => {
        vi.mocked(axios.post).mockResolvedValue({ data: mockResponse })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        const emittedMessage = wrapper.emitted<MessageEmit>('message')
        expect(emittedMessage![0][0]).toEqual(
          { type: 'success', text: 'メーカー情報を1件登録しました。' }
        )
        expect(pushMock).toHaveBeenCalledWith('/makers/1')
      })
    })

    describe('失敗した場合', (): void => {
      it('登録に失敗してバリデーションエラーになること', async (): Promise<void> => {
        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.post).mockRejectedValue({ response: { status: 422 } })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(wrapper.find('.alert').text()).toBe('入力に不備があります。')
      })
    })
  })
})
