import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import StaticPagesCategoryView from '@/components/static_pages/StaticPagesCategoryView.vue'
import axios from 'axios'

const pushMock = vi.fn()
const replaceMock = vi.fn()

vi.mock('axios')

vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock,
        replace: replaceMock
      }
    },
  }
})

beforeEach(() => {
  pushMock.mockClear()
})

describe('StaticPagesCategory', () => {
  let wrapper
  
  describe('DOMの構造', () => {
    beforeEach(async () => {
      axios.get.mockResolvedValue({
        data: [
          { id: 1, item: 'めっき' },
          { id: 2, item: '陽極酸化' },
          { id: 3, item: '化成' },
          { id: 4, item: 'コーティング' },
          { id: 5, item: '表面硬化' },
        ]
      })

      wrapper = mount(StaticPagesCategoryView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出しが存在すること', () => {
      expect(wrapper.find('h3').exists()).toBe(true)
      expect(wrapper.find('h3').text()).toBe('カテゴリーで検索')
    })

    it('検索フォームが表示されること', () => {
      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // 選択要素
      expect(wrapper.find('select').exists()).toBe(true)
      expect(wrapper.find('option[value="めっき"]').text()).toBe('めっき')
      expect(wrapper.find('option[value="陽極酸化"]').text()).toBe('陽極酸化')
      expect(wrapper.find('option[value="化成"]').text()).toBe('化成')
      expect(wrapper.find('option[value="コーティング"]').text()).toBe('コーティング')
      expect(wrapper.find('option[value="表面硬化"]').text()).toBe('表面硬化')

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('検索')
    })

    it('外部リンクが存在すること', () => {
      expect(wrapper.findComponent({ ref: 'linkHome' }).exists()).toBe(true)
      expect(wrapper.findComponent({ ref: 'linkHome' }).text()).toBe('メインメニューへ')
      expect(wrapper.findComponent({ ref: 'linkHome' }).props().to).toBe('/home')
    })
  })

  describe('API通信', () => {
    describe('カテゴリーを選択して送信した場合', () => {
      it('/static_pages/categoryのパスが呼び出されること', async () => {
        axios.get.mockResolvedValue({
          data: [
            { id: 1, item: 'めっき' },
            { id: 2, item: '陽極酸化' },
            { id: 3, item: '化成' },
            { id: 4, item: 'コーティング' },
            { id: 5, item: '表面硬化' },
          ]
        })

        wrapper = mount(StaticPagesCategoryView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        await wrapper.find('select').setValue('めっき')
        await wrapper.find('form').trigger('submit.prevent')

        expect(pushMock).toHaveBeenCalledWith({
          name: 'SearchResults',
          params: { searchMethod: 'category' },
          query: { keyword: 'めっき' }
        })
      })
    })

    describe('カテゴリーリストの取得に成功した場合', () => {
      it('オプション要素に5つのカテゴリーがセットされること', async () => {
        axios.get.mockResolvedValue({
          data: [
            { id: 1, item: 'めっき' },
            { id: 2, item: '陽極酸化' },
            { id: 3, item: '化成' },
            { id: 4, item: 'コーティング' },
            { id: 5, item: '表面硬化' },
          ]
        })

        wrapper = mount(StaticPagesCategoryView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.find('option[value="めっき"]').text()).toBe('めっき')
        expect(wrapper.find('option[value="陽極酸化"]').text()).toBe('陽極酸化')
        expect(wrapper.find('option[value="化成"]').text()).toBe('化成')
        expect(wrapper.find('option[value="コーティング"]').text()).toBe('コーティング')
        expect(wrapper.find('option[value="表面硬化"]').text()).toBe('表面硬化')
      })
    })

    describe('カテゴリーリストの取得に失敗した場合', () => {
      it('404ページに遷移すること', async () => {
        axios.get.mockRejectedValue({
          response: {
            status: 404
          }
        })

        const wrapper = mount(StaticPagesCategoryView, {
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
  })
})
