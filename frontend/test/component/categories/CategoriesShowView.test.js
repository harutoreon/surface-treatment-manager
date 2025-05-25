import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import CategoriesShowView from '@/components/categories/CategoriesShowView.vue'
import axios from 'axios'

vi.mock('axios')

const replaceMock = vi.fn()
const pushMock = vi.fn()

// vi.mock('vue-router', async () => {
vi.mock('vue-router', () => {
  // const actual = await vi.importActual('vue-router')

  return {
    // ...actual,
    useRoute: () => {
      return {
        params: { id: 1 }
      }
    },
    useRouter: () => {
      return {
        replace: replaceMock,
        push: pushMock
      }
    }
  }
})

describe('CategoriesShowView', () => {
  describe('コンポーネントのレンダリング', () => {
    let wrapper

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

    it('カテゴリー情報の見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('カテゴリー情報')
    })

    it('カテゴリー名と概要のラベルと内容が表示されること', async () => {
      await flushPromises()

      const liElement = wrapper.findAll('li')

      expect(liElement[0].findAll('div')[0].text()).toBe('カテゴリー名 :')
      expect(liElement[1].findAll('div')[0].text()).toBe('概要 :')
      expect(liElement[0].findAll('div')[1].text()).toBe('めっき')
      expect(liElement[1].findAll('div')[1].text()).toBe('金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。')
    })

    it('編集、削除、リストの外部リンクが表示されること', () => {
      const links = wrapper.findAllComponents(RouterLinkStub)
      const pElement = wrapper.find('p')

      expect(links[0].text()).toBe('カテゴリー情報の編集')
      expect(links[1].text()).toBe('カテゴリーリストへ')
      expect(pElement.text()).toBe('カテゴリーの削除')
    })

    it('RouterLinkのto属性が適切であること', async () => {
      await flushPromises()

      const links = wrapper.findAllComponents(RouterLinkStub)

      expect(links[0].props().to).toBe('/categories/1/edit')
      expect(links[1].props().to).toBe('/categories')
    })
  })

  describe('API通信', () => {
    describe('カテゴリー情報の取得に成功した場合', () => {
      it('カテゴリー名と概要が表示されること', async () => {
        axios.get.mockResolvedValue({
          data: {
            id: 1,
            item: 'めっき',
            summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
          }
        })

        const wrapper = mount(CategoriesShowView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.text()).toContain('めっき')
        expect(wrapper.text()).toContain('金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。')
      })
    })

    describe('カテゴリー情報の取得に失敗した場合', () => {
      it('404ページに遷移すること', async () => {
        axios.get.mockRejectedValue({
          response: {
            status: 404
          }
        })

        const wrapper = mount(CategoriesShowView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.emitted()).toHaveProperty('message')
        expect(wrapper.emitted().message[0]).toEqual([
          { type: 'danger', text: 'カテゴリーの取得に失敗しました。' }
        ])
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })

    describe('削除処理に成功した場合', () => {
      it('カテゴリーリストに遷移すること', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)

        axios.get.mockResolvedValue({
          data: {
            id: 1,
            item: 'めっき',
            summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
          }
        })

        const wrapper = mount(CategoriesShowView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        await wrapper.find('p').trigger('click')
        
        expect(wrapper.emitted()).toHaveProperty('message')
        expect(wrapper.emitted().message[0]).toEqual([
          { type: 'success', text: 'カテゴリーを1件削除しました。' }
        ])
        expect(pushMock).toHaveBeenCalledWith('/categories')
      })
    })

    describe('削除処理に成功した場合', () => {
      it('404ページに遷移すること', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)

        axios.get.mockResolvedValue({
          data: {
            id: 1,
            item: 'めっき',
            summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
          }
        })

        axios.delete.mockRejectedValue({
          response: {
            status: 404
          }
        })

        const wrapper = mount(CategoriesShowView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })
        
        await flushPromises()
        
        await wrapper.find('p').trigger('click')

        expect(wrapper.emitted()).toHaveProperty('message')
        expect(wrapper.emitted().message[0]).toEqual([
          { type: 'danger', text: '削除処理に失敗しました。' }
        ])
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })
})
