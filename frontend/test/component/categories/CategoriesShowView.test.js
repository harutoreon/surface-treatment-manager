import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import CategoriesShowView from '@/components/categories/CategoriesShowView.vue'
import axios from 'axios'
import { flushPromises } from '@vue/test-utils'

vi.mock('axios')

vi.mock('vue-router', () => ({
  useRoute: () => {
    return {
      params: { id: '1' }
    }
  },
  useRouter: () => {
    return {
      push: vi.fn()
    }
  }
}))

let wrapper

describe('CategoriesShowView', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        id: 1,
        item: 'めっき',
        summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
      }
    })

    wrapper = mount(CategoriesShowView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })
  })

  describe('コンポーネントのレンダリング', () => {
    it('カテゴリー情報の見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('カテゴリー情報')
    })

    it('カテゴリー名と概要が表示されること', async () => {
      await flushPromises()

      const liElement = wrapper.findAll('li')

      expect(liElement[0].findAll('div')[0].text()).toBe('カテゴリー名 :')
      expect(liElement[1].findAll('div')[0].text()).toBe('概要 :')
      expect(liElement[0].findAll('div')[1].text()).toBe('めっき')
      expect(liElement[1].findAll('div')[1].text()).toBe('金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。')
    })

    it('3つの外部リンクが表示されること', () => {
      const links = wrapper.findAllComponents(RouterLinkStub)
      const pElement = wrapper.find('p')

      expect(links[0].text()).toBe('カテゴリー情報の編集')
      expect(links[1].text()).toBe('カテゴリーリストへ')
      expect(pElement.text()).toBe('カテゴリーの削除')
    })

    it('RouterLinkにto属性が定義されていること', async () => {
      await flushPromises()

      const links = wrapper.findAllComponents(RouterLinkStub)

      expect(links[0].props().to).toBe('/categories/1/edit')
      expect(links[1].props().to).toBe('/categories')
    })
  })

  describe('イベントの発火', () => {
    describe('カテゴリーの削除の選択でOKを押した場合、', () => {
      it('trueが返りhandleDeleteのイベントが発火すること', async () => {
        const spy = vi.spyOn(window, 'confirm').mockReturnValue(true)

        await wrapper.find('p').trigger('click')

        expect(spy.mock.results[0].value).toBe(true)
      })
    })

    describe('カテゴリーの削除の選択でキャンセルを押した場合、', () => {
      it('falseが返りhandleDeleteのイベントが発火しないこと', async () => {
        const spy = vi.spyOn(window, 'confirm').mockReturnValue(false)

        await wrapper.find('p').trigger('click')

        expect(spy.mock.results[0].value).toBe(false)
      })
    })
  })
})
