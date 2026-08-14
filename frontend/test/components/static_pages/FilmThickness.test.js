import FilmThickness from '@/components/static_pages/FilmThickness.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RouterLinkStub, mount, flushPromises } from '@vue/test-utils'

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

describe('FilmThickness Component', () => {
  const mountComponent = () =>
    mount(FilmThickness, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    beforeEach(() => {
      vi.clearAllMocks()
    })

  describe('初期レンダリングの検証', () => {
    it('見出しが表示されること', async () => {
      const wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('変寸量で検索')
    })

    it('検索フォームが表示されること', async () => {
      const wrapper = mountComponent()
      await flushPromises()

      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      const label = wrapper.findAll('label')
      expect(label[0].text()).toBe('膜厚（μm）')
      expect(label[1].text()).toBe('誤差（±μm）')

      // 入力要素
      expect(wrapper.find('#film-thickness').exists()).toBe(true)
      expect(wrapper.find('#allowable-error').exists()).toBe(true)

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('検索')
    })

    it('ナビゲーションリンクが表示されること', async () => {
      const wrapper = mountComponent()
      await flushPromises()

      const routerLink = wrapper.findComponent(RouterLinkStub)
      expect(routerLink.props().to).toBe('/home')
      expect(routerLink.text()).toBe('メインメニューへ')
    })
  })

  describe('入力値の有効性検証', () => {
    describe('膜厚と誤差を入力して検索した場合', () => {
      it('検索結果ページに遷移すること', async () => {
        const wrapper = mountComponent()
        await flushPromises()

        wrapper.find('#film-thickness').setValue('5')
        wrapper.find('#allowable-error').setValue('2')

        wrapper.find('button').trigger('submit')
        await flushPromises()

        expect(pushMock).toHaveBeenCalledWith(
          {
            path: '/static_pages/film_thickness/search_results',
            query: {
              min_film_thickness: 3,
              max_film_thickness: 7
            }
          }
        )
      })
    })

    describe('膜厚と誤差を未入力で検索した場合', () => {
      it('バリデーションエラーになる', async () => {
        const wrapper = mountComponent()
        await flushPromises()

        wrapper.find('#film-thickness').setValue('0')
        wrapper.find('#allowable-error').setValue('0')

        wrapper.find('button').trigger('submit')
        await flushPromises()

        expect(wrapper.find('.alert').text()).toBe('変寸量または誤差を入力して下さい。')
      })
    })
  })
})
