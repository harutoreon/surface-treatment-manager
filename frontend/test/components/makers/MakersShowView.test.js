import MakersShowView from '@/components/makers/MakersShowView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const pushMock = vi.fn()
const replaceMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', async () => {
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

describe('MakersShowView', () => {
  let wrapper

  describe('ログインチェックに成功した場合', () => {
    it('メーカー情報ページに移動すること', async () => {
      axios.get
        .mockResolvedValueOnce({  // checkLoginStatus()
          response: {
            status: 200
          }
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

      wrapper = mount(MakersShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('メーカー情報')
    })
  })

  describe('ログインチェックに失敗した場合', () => {
    it('ログインページに移動すること', async () => {
      axios.get.mockRejectedValue({  // checkLoginStatus()
        response: {
          status: 401
        }
      })

      wrapper = mount(MakersShowView, {
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
    })
  })

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({  // checkLoginStatus()
          response: {
            status: 200
          }
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

      wrapper = mount(MakersShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('メーカー情報')
    })

    it('メーカー情報が表示されること', () => {
      // メーカー名
      expect(wrapper.text()).toContain('有限会社中野銀行')

      // 郵便番号
      expect(wrapper.text()).toContain('962-0713')

      // 住所
      expect(wrapper.text()).toContain('東京都渋谷区神南1-2-0')

      // 電話番号
      expect(wrapper.text()).toContain('070-3288-2552')

      // FAX番号
      expect(wrapper.text()).toContain('070-2623-8399')

      // Emailアドレス
      expect(wrapper.text()).toContain('sample_maker0@example.com')

      // ホームページアドレス
      expect(wrapper.text()).toContain('https://example.com/sample_maker0')

      // 担当者
      expect(wrapper.text()).toContain('宮本 悠斗')
    })

    it('外部リンクが表示されること', () => {
      const routerLinks = wrapper.findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLinks[0].props().to).toBe('/makers/1/edit')
      expect(routerLinks[1].props().to).toBe('/makers')

      // テキスト
      expect(routerLinks[0].text()).toBe('メーカー情報の編集へ')
      expect(routerLinks[1].text()).toBe('メーカーリストへ')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    it('404ページに遷移すること', async ()  => {
      axios.get
        .mockResolvedValue({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockRejectedValue({  // fetchMakerData()
          response: {
            status: 404
          }
        })

      wrapper = mount(MakersShowView, {
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

  describe('メーカー情報の削除に成功した場合', () => {
    it('メーカーリストページに遷移すること', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true)

      axios.get
        .mockResolvedValueOnce({  // checkLoginStatus()
          response: {
            status: 200
          }
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

      wrapper = mount(MakersShowView, {
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
        { type: 'success', text: 'メーカー情報を1件削除しました。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/makers')
    })    
  })

  describe('メーカー情報の削除に失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true)

      axios.get
        .mockResolvedValueOnce({  // checkLoginStatus()
          response: {
            status: 200
          }
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

      axios.delete.mockRejectedValue({
        response: {
          status: 404
        }
      })

      wrapper = mount(MakersShowView, {
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
        { type: 'danger', text: 'メーカー情報の削除処理に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })
})
