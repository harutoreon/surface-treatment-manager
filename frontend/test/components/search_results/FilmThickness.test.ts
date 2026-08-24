import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, RouterLinkStub, mount} from '@vue/test-utils'
import axios from 'axios'
import FilmThickness from '@/components/search_results/FilmThickness.vue'
import type { VueWrapper } from '@vue/test-utils'
import type { Sample, NotificationMessage } from '@/components/search_results/FilmThickness.vue'
import type { LocationQuery } from 'vue-router'

const { replaceMock, pushMock } = vi.hoisted(() => {
  return {
    replaceMock: vi.fn(),
    pushMock: vi.fn(),
  }
})

const mockRoute = {
  query: { min_film_thickness: '3', max_film_thickness: '7' } as LocationQuery,
}

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => mockRoute,
    useRouter: () => {
      return {
        replace: replaceMock,
        push: pushMock,
      }
    }
  }
})

describe('FilmThickness Component', (): void => {
  const mockResponse: Sample[] = [
    {
      id: 1,
      name: '無電解ニッケルめっき',
      feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
      film_thickness: '5μm',
      color: 'イエローブラウンシルバー',
    }
  ]

  const mountComponent = (): VueWrapper => mount(FilmThickness, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
      }
    }
  })

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期レンダリングの検証', (): void => {
    describe('fetchSamples() が成功した場合', (): void => {
      it('見出しが表示される', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })         // checkLoginStatus()
          .mockResolvedValueOnce({ data: mockResponse })  // fetchSamples()

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        expect(wrapper.find('h3').text()).toBe('表面処理の検索結果')
      })

      it('検索条件と該当件数が表示される', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })         // checkLoginStatus()
          .mockResolvedValueOnce({ data: mockResponse })  // fetchSamples()

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        expect(wrapper.find('#search-result-message').text()).toBe('3 μm から 7 μm の範囲で 1 件該当')
      })

      it('該当する表面処理情報がリンク付きで表示される', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })         // checkLoginStatus()
          .mockResolvedValueOnce({ data: mockResponse })  // fetchSamples()

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        const routerLink = wrapper.findComponent(RouterLinkStub)

        expect(routerLink.props().to).toBe(`/samples/${mockResponse[0].id}`)
        expect(routerLink.text()).toContain(mockResponse[0].name)
        expect(routerLink.text()).toContain(mockResponse[0].feature)
        expect(routerLink.text()).toContain(mockResponse[0].film_thickness)
        expect(routerLink.text()).toContain(mockResponse[0].color)
      })

      it('ナビゲージョンリンクが表示される', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })         // checkLoginStatus()
          .mockResolvedValueOnce({ data: mockResponse })  // fetchSamples()

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        const nav = wrapper.find('.nav')
        const routerLinks = nav.findAllComponents(RouterLinkStub)

        // 再検索
        expect(routerLinks[0].props().to).toBe('/static_pages/film_thickness')
        expect(routerLinks[0].text()).toBe('再検索')

        // メインメニューへ
        expect(routerLinks[1].props().to).toBe('/home')
        expect(routerLinks[1].text()).toBe('メインメニューへ')
      })
    })

    describe('fetchSamples() が失敗した場合', (): void => {
      it('エラーメッセージ付きで NotFound ルートに遷移する', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })                // checkLoginStatus()
          .mockRejectedValueOnce({ response: { status: 404 } })  // fetchSamples()

        vi.mocked(axios.isAxiosError).mockReturnValue(true)

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        const emittedMessage = wrapper.emitted<NotificationMessage>('message')
        expect(emittedMessage).toBeTruthy()
        expect(emittedMessage[0][0]).toEqual(
          { type: 'danger', text: 'サンプルの取得に失敗しました。' }
        )
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound'})
      })
    })
  })

  describe('searchResultMessage の検証', (): void => {
    it('minFilmThickness と minFilmThickness を変更すると再計算される', async (): Promise<void> => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })         // checkLoginStatus()
        .mockResolvedValueOnce({ data: mockResponse })  // fetchSamples()

      mockRoute.query.min_film_thickness = '4'
      mockRoute.query.max_film_thickness = '6'

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.text()).toContain('4 μm から 6 μm の範囲で 1 件該当')
    })

    it('最小膜厚が 8 で最大膜厚が 12 の場合、「該当する表面処理が無い」メッセージが表示される', async (): Promise<void> => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })  // checkLoginStatus()
        .mockResolvedValueOnce({ data: [] })     // fetchSamples()

      mockRoute.query.min_film_thickness = '8'
      mockRoute.query.max_film_thickness = '12'

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.text()).toContain('該当する表面処理はありませんでした。')
    })
  })
})
