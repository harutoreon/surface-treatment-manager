import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, RouterLinkStub, mount} from '@vue/test-utils'
import { nextTick } from 'vue'
import FilmThickness from '@/components/search_results/FilmThickness.vue'

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
        push: pushMock,
      }
    }
  }
})

describe('FilmThickness Component', () => {
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
      const wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('表面処理の検索結果')
    })

    it('検索条件と該当件数が表示される', async () => {
      const wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.vm.searchResultMessage).toBe('3 μm から 7 μm の範囲で 1 件該当')
    })

    it('該当する表面処理情報がリンク付きで表示される', async () => {
      const wrapper = mountComponent()
      await flushPromises()

      const routerLink = wrapper.findComponent(RouterLinkStub)
      const sample = wrapper.vm.samples[0]

      expect(routerLink.props().to).toBe(`/samples/${sample.id}`)
      expect(routerLink.text()).toContain(sample.name)
      expect(routerLink.text()).toContain(sample.feature)
      expect(routerLink.text()).toContain(sample.film_thickness)
      expect(routerLink.text()).toContain(sample.color)
    })

    it('ナビゲージョンリンクが表示される', async () => {
      const wrapper = mountComponent()
      await flushPromises()

      const nav = wrapper.find('.nav')
      const routerLinks = nav.findAllComponents(RouterLinkStub)

      // 再検索リンク
      expect(routerLinks[0].props().to).toBe('/static_pages/film_thickness')
      expect(routerLinks[0].text()).toBe('再検索')

      // メインメニューへ
      expect(routerLinks[1].props().to).toBe('/home')
      expect(routerLinks[1].text()).toBe('メインメニューへ')
    })
  })

  describe('searchResultMessage の検証', () => {
    it('minFilmThickness と minFilmThickness を変更すると再計算される', async () => {
      const wrapper = mountComponent()
      await flushPromises()

      wrapper.vm.minFilmThickness = 4
      wrapper.vm.maxFilmThickness = 6
      await nextTick()

      expect(wrapper.vm.searchResultMessage).toBe('4 μm から 6 μm の範囲で 1 件該当')
    })

    it('samples が 0 件のとき「0 件該当」になる', async () => {
      const wrapper = mountComponent()
      await flushPromises()

      wrapper.vm.samples.splice(0, wrapper.vm.samples.length)
      await nextTick()

      expect(wrapper.vm.searchResultMessage).toBe('3 μm から 7 μm の範囲で 0 件該当')
      expect(wrapper.text()).toContain('該当する表面処理はありませんでした。')
    })

    it('samples が 0 件のとき「該当する表面処理が無い」メッセージが表示される', async () => {
      const wrapper = mountComponent()
      await flushPromises()

      wrapper.vm.samples.splice(0, wrapper.vm.samples.length)
      await nextTick()

      expect(wrapper.text()).toContain('該当する表面処理はありませんでした。')
    })
  })
})
