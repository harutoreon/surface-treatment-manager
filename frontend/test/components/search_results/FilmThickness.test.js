import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, RouterLinkStub, mount} from '@vue/test-utils'
import axios from 'axios'
import FilmThickness from '@/components/search_results/FilmThickness.vue'

const { replaceMock, pushMock, mockRoute } = vi.hoisted(() => {
  return {
    replaceMock: vi.fn(),
    pushMock: vi.fn(),
    mockRoute: { query: { min_film_thickness: 3, max_film_thickness: 7 } },
  }
})

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

describe('FilmThickness Component', () => {
  const mockResponse = [
    {
      id: 1,
      name: '無電解ニッケルめっき',
      color: 'イエローブラウンシルバー',
      film_thickness: '5μm',
      feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
    }
  ]

  const mountComponent = () => mount(FilmThickness, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
      }
    }
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('初期レンダリングの検証', () => {
    it('見出しが表示される', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })         // checkLoginStatus()
        .mockResolvedValueOnce({ data: mockResponse })  // fetchSamples()

      const wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('表面処理の検索結果')
    })

    it('検索条件と該当件数が表示される', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })         // checkLoginStatus()
        .mockResolvedValueOnce({ data: mockResponse })  // fetchSamples()

      const wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.vm.searchResultMessage).toBe('3 μm から 7 μm の範囲で 1 件該当')
    })

    it('該当する表面処理情報がリンク付きで表示される', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })         // checkLoginStatus()
        .mockResolvedValueOnce({ data: mockResponse })  // fetchSamples()

      const wrapper = mountComponent()
      await flushPromises()

      const routerLink = wrapper.findComponent(RouterLinkStub)

      expect(routerLink.props().to).toBe(`/samples/${mockResponse[0].id}`)
      expect(routerLink.text()).toContain(mockResponse[0].name)
      expect(routerLink.text()).toContain(mockResponse[0].feature)
      expect(routerLink.text()).toContain(mockResponse[0].film_thickness)
      expect(routerLink.text()).toContain(mockResponse[0].color)
    })

    it('ナビゲージョンリンクが表示される', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })         // checkLoginStatus()
        .mockResolvedValueOnce({ data: mockResponse })  // fetchSamples()

      const wrapper = mountComponent()
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

  describe('searchResultMessage の検証', () => {
    it('minFilmThickness と minFilmThickness を変更すると再計算される', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })         // checkLoginStatus()
        .mockResolvedValueOnce({ data: mockResponse })  // fetchSamples()

      mockRoute.query.min_film_thickness = 4
      mockRoute.query.max_film_thickness = 6

      const wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.text()).toContain('4 μm から 6 μm の範囲で 1 件該当')
    })

    it('最小膜厚が 8 で最大膜厚が 12 の場合、「該当する表面処理が無い」メッセージが表示される', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })  // checkLoginStatus()
        .mockResolvedValueOnce({ data: [] })     // fetchSamples()

      mockRoute.query.min_film_thickness = 8
      mockRoute.query.max_film_thickness = 12

      const wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.text()).toContain('該当する表面処理はありませんでした。')
    })
  })
})
