import MakersIndexView from '@/components/makers/MakersIndexView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import axios from 'axios'

const replaceMock: ReturnType<typeof vi.fn> = vi.fn()

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

interface Maker {
  id: number
  name: string
  address: string
  phone_number: string
  fax_number: string
}

interface MakerResponse {
  makers: Maker[]
  current_page: number
  total_pages: number
}

interface MessageEvent {
  type: 'danger' | 'success' | 'warning' | 'info'
  text: string
}

describe('MakersIndexView', () => {
  const mockResponse: MakerResponse = {
    makers: [
      {
        id: 1,
        name: '東亜電化工業株式会社',
        address: '山口県西悠斗町1-2-1',
        phone_number: '070-8007-8335',
        fax_number: '080-4377-8360',
      },
    ],
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
  })

  describe('初期レンダリングに成功した場合', (): void => {
    it('メーカーページが表示されること', async (): Promise<void> => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ data: mockResponse })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      // 見出し
      expect(wrapper.find('h3').text()).toBe('メーカーリスト')

      // メーカー名
      expect(wrapper.text()).toContain('東亜電化工業株式会社')

      // 住所
      expect(wrapper.text()).toContain('山口県西悠斗町1-2-1')

      // 電話番号
      expect(wrapper.text()).toContain('070-8007-8335')

      // FAX番号
      expect(wrapper.text()).toContain('080-4377-8360')

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
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockRejectedValueOnce({ response: { status: 404 } })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const emittedMessage = wrapper.emitted<MessageEvent>('message')
      expect(emittedMessage).toBeTruthy()
      expect(emittedMessage[0][0]).toEqual(
        { type: 'danger', text: 'メーカーリストの取得に失敗しました。' }
      )
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  }) 
})
