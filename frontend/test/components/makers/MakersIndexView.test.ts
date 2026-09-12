import MakersIndexView from '@/components/makers/MakersIndexView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import type { MessageEmit } from '@/env'
import type { Maker, MakerListResponse } from '@/composables/makers/useMakers'

import axios from 'axios'

const { requireLoginMock, replaceMock } = vi.hoisted(() => {
  return {
    requireLoginMock: vi.fn(),
    replaceMock: vi.fn()
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        query: { page: '1' }
      }
    },
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

describe('MakersIndexView', () => {
  const makerMockResponse: Maker = {
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

  const makerListMockResponse: MakerListResponse = {
    makers: [makerMockResponse],
    current_page: 1,
    total_pages: 1
  }

  const mountComponent = (): VueWrapper => mount(MakersIndexView, {
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

  describe('初期レンダリングに成功した場合', (): void => {
    it('メーカーページが表示されること', async (): Promise<void> => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: makerListMockResponse })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      // 見出し
      expect(wrapper.find('h3').text()).toBe('メーカーリスト')

      // メーカー名
      expect(wrapper.text()).toContain('有限会社中野銀行')

      // 住所
      expect(wrapper.text()).toContain('東京都渋谷区神南1-2-0')

      // 電話番号
      expect(wrapper.text()).toContain('070-3288-2552')

      // FAX番号
      expect(wrapper.text()).toContain('070-2623-8399')

      // ページネーション
      expect(wrapper.text()).toContain('前ページ')
      expect(wrapper.text()).toContain('次ページ')
      expect(wrapper.find('a[class="page-link"]').text()).toBe('1')

      // 外部リンク
      const ulElements = wrapper.findAll('ul')
      const routerLinks = ulElements[1].findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLinks[0].props().to).toBe('/makers/new')
      expect(routerLinks[1].props().to).toBe('/home')

      // テキスト
      expect(routerLinks[0].text()).toBe('メーカー情報の登録')
      expect(routerLinks[1].text()).toBe('メインメニューへ')
    })
  })
  
  describe('初期レンダリングに失敗した場合', (): void => {
    it('404ページに遷移すること', async (): Promise<void> => {
      vi.mocked(axios.isAxiosError).mockReturnValue(true)
      vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 404 } })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const emittedMessage = wrapper.emitted<MessageEmit>('message')
      expect(emittedMessage![0][0]).toEqual(
        { type: 'danger', text: 'メーカーリストの取得に失敗しました。' }
      )
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  }) 
})
