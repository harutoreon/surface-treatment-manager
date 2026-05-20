import SamplesIndexView from '@/components/samples/SamplesIndexView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import type { SampleListResponse, Emit } from '@/composables/samples/useSamplesIndex.ts'
import axios from 'axios'

const { replaceMock } = vi.hoisted(() => {
  return {
    replaceMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        query: { page: 1 }
      }
    },
    useRouter: () => {
      return {
        replace: replaceMock,
      }
    }
  }
})

describe('SamplesIndexView', (): void => {
  const mountComponent = (): VueWrapper => mount(SamplesIndexView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  const mockResponse: SampleListResponse = {
    samples: [
      {
        id: 1,
        name: 'クロムめっき',
        color: 'シルバー',
        feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
      },
    ],
    current_page: 1,
    total_pages: 1
  }

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期レンダリングに成功した場合', (): void => {
    it('表面処理リストページが表示されること', async (): Promise<void> => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ data: mockResponse })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      // 見出し
      expect(wrapper.find('h3').text()).toBe('表面処理リスト')

      // 処理名
      expect(wrapper.find('#sample-name-1').text()).toBe('クロムめっき')

      // 主な機能
      expect(wrapper.find('#sample-feature-1').text()).toBe('耐食性・耐摩耗性・耐薬品性・耐熱性')

      // 色
      expect(wrapper.find('#sample-color-1').text()).toBe('シルバー')

      // ページネーション
      expect(wrapper.text()).toContain('前ページ')
      expect(wrapper.text()).toContain('次ページ')
      expect(wrapper.find('a[class="page-link"]').text()).toBe('1')

      // 外部リンク
      const ulElements = wrapper.findAll('ul')
      const routerLinks = ulElements[1].findAllComponents(RouterLinkStub)

      expect(routerLinks[0].props().to).toBe('/samples/new')
      expect(routerLinks[1].props().to).toBe('/home')
      expect(routerLinks[0].text()).toBe('表面処理情報の登録')
      expect(routerLinks[1].text()).toBe('メインメニューへ')
    })
  })
    
  describe('初期レンダリングに失敗した場合', (): void => {
    it('404 ページに遷移すること', async (): Promise<void> => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockRejectedValueOnce({ response: { status: 404 } })
      vi.mocked(axios.isAxiosError).mockReturnValue(true)


      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const emittedMessage = wrapper.emitted<Emit>('message')
      expect(emittedMessage).toBeTruthy()
      expect(emittedMessage![0][0]).toEqual(
        { type: 'danger', text: '表面処理リストの取得に失敗しました。' })

      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })
})
