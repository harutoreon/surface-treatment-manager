import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import StaticPagesCategoryView from '@/components/static_pages/StaticPagesCategoryView.vue'

const pushMock = vi.fn()

vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock
      }
    }
  }
})

beforeEach(() => {
  pushMock.mockClear()
})

describe('StaticPagesCategory', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(StaticPagesCategoryView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })
  })
  
  describe('DOMの構造', () => {
    it('見出しが存在すること', () => {
      expect(wrapper.find('h3').exists()).toBe(true)
      expect(wrapper.find('h3').text()).toBe('カテゴリーで検索')
    })

    it('ドロップダウンリストが存在すること', () => {
      expect(wrapper.find('select').exists()).toBe(true)

      expect(wrapper.find('option[value="めっき"]').exists()).toBe(true)
      expect(wrapper.find('option[value="めっき"]').text()).toBe('めっき')
      
      expect(wrapper.find('option[value="陽極酸化"]').exists()).toBe(true)
      expect(wrapper.find('option[value="陽極酸化"]').text()).toBe('陽極酸化')
      
      expect(wrapper.find('option[value="化成"]').exists()).toBe(true)
      expect(wrapper.find('option[value="化成"]').text()).toBe('化成')
      
      expect(wrapper.find('option[value="コーティング"]').exists()).toBe(true)
      expect(wrapper.find('option[value="コーティング"]').text()).toBe('コーティング')
      
      expect(wrapper.find('option[value="表面硬化"]').exists()).toBe(true)
      expect(wrapper.find('option[value="表面硬化"]').text()).toBe('表面硬化')
    })

    it('ボタンが存在すること', () => {
      expect(wrapper.find('button').exists()).toBe(true)
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
        await wrapper.find('select').setValue('めっき')
        expect(wrapper.find('select').element.value).toBe('めっき')

        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(pushMock).toHaveBeenCalledWith({
          name: 'SearchResults',
          params: { searchMethod: 'category' },
          query: { keyword: 'めっき' }
        })
      })
    })
  })
})
