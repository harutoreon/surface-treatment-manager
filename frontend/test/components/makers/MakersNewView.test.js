import MakersNewView from '@/components/makers/MakersNewView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

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

describe('MakersNewView', () => {
  let wrapper

  describe('初期レンダリング', () => {
    beforeEach(() => {
      wrapper = mount(MakersNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })
    })
    
    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('メーカー情報の登録')
    })

    it('入力フォームが表示されること', () => {
      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      expect(wrapper.find('label[for="maker-name"]').text()).toBe('メーカー名')
      expect(wrapper.find('label[for="maker-postal-code"]').text()).toBe('郵便番号')
      expect(wrapper.find('label[for="maker-address"]').text()).toBe('住所')
      expect(wrapper.find('label[for="maker-phone-number"]').text()).toBe('電話番号')
      expect(wrapper.find('label[for="maker-fax-number"]').text()).toBe('FAX番号')
      expect(wrapper.find('label[for="maker-email"]').text()).toBe('Email')
      expect(wrapper.find('label[for="maker-home-page"]').text()).toBe('ホームページ')
      expect(wrapper.find('label[for="maker-manufacturer-rep"]').text()).toBe('担当者')

      // 入力要素
      expect(wrapper.find('#maker-name').exists()).toBe(true)
      expect(wrapper.find('#maker-postal-code').exists()).toBe(true)
      expect(wrapper.find('#maker-address').exists()).toBe(true)
      expect(wrapper.find('#maker-phone-number').exists()).toBe(true)
      expect(wrapper.find('#maker-fax-number').exists()).toBe(true)
      expect(wrapper.find('#maker-email').exists()).toBe(true)
      expect(wrapper.find('#maker-home-page').exists()).toBe(true)
      expect(wrapper.find('#maker-manufacturer-rep').exists()).toBe(true)

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('登録')
    })

    it('外部リンクが表示されること', () => {
      const routerLink = wrapper.findComponent(RouterLinkStub)

      expect(routerLink.props().to).toBe('/makers')
      expect(routerLink.text()).toBe('メーカーリストへ')
    })
  })
  
  describe('有効な情報を送信した場合', () => {
    it('登録に成功すること', async () => {
      axios.post.mockResolvedValue({
        data: {
          id: 1,
          name: '有限会社中野銀行',
          postal_code: '962-0713',
          address: '東京都渋谷区神南1-2-0',
          phone_number: '070-3288-2552',
          fax_number: '070-2623-8399',
          email: 'sample_maker0@example.com',
          home_page: 'https://example.com/sample_maker0',
          manufacturer_rep: '宮本 悠斗'
        }
      })

      wrapper = mount(MakersNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'success', text: 'メーカー情報を1件登録しました。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/makers/1')
    })
  })

  describe('無効な情報を送信した場合', () => {
    it('登録に失敗すること', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 422
        }
      })
      
      wrapper = mount(MakersNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await wrapper.find('form').trigger('submit.prevent')
      
      await flushPromises()
    
      expect(wrapper.text()).toContain('入力に不備があります。')
    })
  })
})
