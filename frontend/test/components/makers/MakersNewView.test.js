import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import MakersNewView from '@/components/makers/MakersNewView.vue'
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
  describe('初期レンダリング', () => {
    let wrapper

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
      expect(wrapper.findComponent({ ref: 'linkMakers' }).text()).toBe('メーカーリストへ')
      expect(wrapper.findComponent({ ref: 'linkMakers' }).props().to).toBe('/makers')
    })
  })
  
  describe('API通信', () => {
    describe('有効な情報を送信すると、', () => {
      it('登録が成功すること', async () => {
        axios.post.mockResolvedValue({
          data: {
            id: 1,
            name: '株式会社テスト',
          }
        })

        const wrapper = mount(MakersNewView, {
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

    describe('空の状態で送信すると、', () => {
      it('登録が失敗すること', async () => {
        axios.post.mockRejectedValue(new Error('Validation Error'))
        
        const wrapper = mount(MakersNewView, {
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
})
