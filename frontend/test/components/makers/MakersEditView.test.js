import MakersEditView from '@/components/makers/MakersEditView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const pushMock = vi.fn()
const replaceMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        params: { id: 1 }
      }
    },
    useRouter: () => {
      return {
        push: pushMock,
        replace: replaceMock
      }
    }
  }
})

describe('MakersEditView', () => {
  let wrapper

  describe('ログインチェックに成功した場合', () => {
    it('メーカー情報の編集ページに移動すること', async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({  // fetchMakerData()
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

      wrapper = mount(MakersEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('メーカー情報の編集')
    })
  })

  describe('ログインチェックに失敗した場合', () => {
    it('ログインページに移動すること', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 401
        }
      })

      wrapper = mount(MakersEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: 'ログインが必要です。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/')

      const id = 1
      expect(pushMock).not.toHaveBeenCalledWith(`/makers/${id}`)
    })
  })

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
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

      wrapper = mount(MakersEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出しが存在すること', () => {
      expect(wrapper.find('h3').text()).toBe('メーカー情報の編集')
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
      expect(wrapper.find('button').text()).toBe('更新')
    })

    it('外部リンクが存在すること', () => {
      const routerLinks = wrapper.findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLinks[0].props().to).toBe('/makers/1')
      expect(routerLinks[1].props().to).toBe('/makers')

      // テキスト
      expect(routerLinks[0].text()).toBe('メーカー情報へ')
      expect(routerLinks[1].text()).toBe('メーカーリストへ')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockRejectedValueOnce({
          response: {
            status: 404
          }
        })

      wrapper = mount(MakersEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: 'メーカー情報の取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('有効な情報を送信した場合', () => {
    it('更新に成功すること', async () => {
      const mockResponse = {
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
      }
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce(mockResponse)

      axios.patch.mockResolvedValue(mockResponse)
      
      wrapper = mount(MakersEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('#maker-name').element.value).toBe('有限会社中野銀行')
      expect(wrapper.find('#maker-postal-code').element.value).toBe('962-0713')
      expect(wrapper.find('#maker-address').element.value).toBe('東京都渋谷区神南1-2-0')
      expect(wrapper.find('#maker-phone-number').element.value).toBe('070-3288-2552')
      expect(wrapper.find('#maker-fax-number').element.value).toBe('070-2623-8399')
      expect(wrapper.find('#maker-email').element.value).toBe('sample_maker0@example.com')
      expect(wrapper.find('#maker-home-page').element.value).toBe('https://example.com/sample_maker0')
      expect(wrapper.find('#maker-manufacturer-rep').element.value).toBe('宮本 悠斗')

      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'success', text: 'メーカー情報を更新しました。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/makers/1')
    })
  })

  describe('無効な情報を送信した場合', () => {
    it('更新に失敗すること', async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
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

      axios.patch.mockRejectedValue({
        response: {
          status: 422
        }
      })

      wrapper = mount(MakersEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.text()).toContain('入力に不備があります。')
    })
  })
})
