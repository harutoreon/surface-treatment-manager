import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import MakersShowView from '@/components/makers/MakersShowView.vue'
import axios from 'axios'

vi.mock('axios')

const pushMock = vi.fn()
const replaceMock = vi.fn()

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
  describe('DOMの構造', () => {
    let wrapper

    beforeEach(async () => {
      axios.get.mockResolvedValue({
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
        }})

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

      // FAX 番号
      expect(wrapper.text()).toContain('070-2623-8399')

      // Email アドレス
      expect(wrapper.text()).toContain('sample_maker0@example.com')

      // ホームページアドレス
      expect(wrapper.text()).toContain('https://example.com/sample_maker0')

      // 担当者
      expect(wrapper.text()).toContain('宮本 悠斗')
    })

    it('外部リンクが表示されること', () => {
      expect(wrapper.findComponent({ ref: 'linkMakersEdit' }).props().to).toBe('/makers/1/edit')
      expect(wrapper.findComponent({ ref: 'linkMakersEdit' }).text()).toBe('メーカー情報の編集へ')
      expect(wrapper.findComponent({ ref: 'linkMakers' }).props().to).toBe('/makers')
      expect(wrapper.findComponent({ ref: 'linkMakers' }).text()).toBe('メーカーリストへ')
    })
  })

  describe('API通信', () => {
    describe('メーカー情報の取得に成功した場合', () => {
      it('メーカー情報が表示されること', async () => {
        axios.get.mockResolvedValue({
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

        const wrapper = mount(MakersShowView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.text()).toContain('有限会社中野銀行')
        expect(wrapper.text()).toContain('962-0713')
        expect(wrapper.text()).toContain('東京都渋谷区神南1-2-0')
        expect(wrapper.text()).toContain('070-3288-2552')
        expect(wrapper.text()).toContain('070-2623-8399')
        expect(wrapper.text()).toContain('sample_maker0@example.com')
        expect(wrapper.text()).toContain('https://example.com/sample_maker0')
        expect(wrapper.text()).toContain('宮本 悠斗')
      })
    })

    describe('メーカー情報の取得に失敗した場合', () => {
      it('404ページに遷移すること', async ()  => {
        axios.get.mockRejectedValue({
          response: {
            status: 404
          }
        })

        const wrapper = mount(MakersShowView, {
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
      it('削除成功のメッセージが表示されメーカーリストページに遷移すること', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)
    
        axios.get.mockResolvedValue({
          data: { 
            id: 1,
          }
        })

        const wrapper = mount(MakersShowView, {
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

        axios.get.mockResolvedValue({
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

        const wrapper = mount(MakersShowView, {
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

    it('削除選択で「いいえ」を選択した場合は削除処理がキャンセルされること', async () => {
      const spy = vi.spyOn(window, 'confirm').mockReturnValue(false)
      
      axios.get.mockResolvedValue({
        data: { 
          id: 1,
        }
      })

      const wrapper = mount(MakersShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      await wrapper.find('p').trigger('click')

      expect(spy.mock.results[0].value).toBe(false)
    })
  })
})
