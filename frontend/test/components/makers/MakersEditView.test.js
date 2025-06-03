import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import MakersEditView from '@/components/makers/MakersEditView.vue'
import axios from 'axios'

vi.mock('axios')

const pushMock = vi.fn()
const replaceMock = vi.fn()

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
  describe('DOMの構造', () => {
    let wrapper

    beforeEach(async () => {
      axios.get.mockResolvedValue({
        data: {
          id: 1,
          name: "有限会社中野銀行",
          postal_code: "962-0713",
          address: "東京都渋谷区神南1-2-0",
          phone_number: "070-3288-2552",
          fax_number: "070-2623-8399",
          email: "sample_maker0@example.com",
          home_page: "https://example.com/sample_maker0",
          manufacturer_rep: "宮本 悠斗"
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

    it('フォームが存在すること', () => {
      expect(wrapper.find('form').exists()).toBe(true)
    })

    it('ラベルが存在すること', () => {
      expect(wrapper.find('label[for="maker_name"]').exists()).toBe(true)
      expect(wrapper.find('label[for="maker_name"]').text()).toBe('メーカー名')

      expect(wrapper.find('label[for="maker_postal_code"]').exists()).toBe(true)
      expect(wrapper.find('label[for="maker_postal_code"]').text()).toBe('郵便番号')

      expect(wrapper.find('label[for="maker_address"]').exists()).toBe(true)
      expect(wrapper.find('label[for="maker_address"]').text()).toBe('住所')

      expect(wrapper.find('label[for="maker_phone_number"]').exists()).toBe(true)
      expect(wrapper.find('label[for="maker_phone_number"]').text()).toBe('電話番号')

      expect(wrapper.find('label[for="maker_fax_number"]').exists()).toBe(true)
      expect(wrapper.find('label[for="maker_fax_number"]').text()).toBe('FAX番号')

      expect(wrapper.find('label[for="maker_email"]').exists()).toBe(true)
      expect(wrapper.find('label[for="maker_email"]').text()).toBe('Email')

      expect(wrapper.find('label[for="maker_home_page"]').exists()).toBe(true)
      expect(wrapper.find('label[for="maker_home_page"]').text()).toBe('ホームページ')

      expect(wrapper.find('label[for="maker_manufacturer_rep"]').exists()).toBe(true)
      expect(wrapper.find('label[for="maker_manufacturer_rep"]').text()).toBe('担当者')
    })

    it('フォームフィールドが存在すること', () => {
      expect(wrapper.find('#maker_name').exists()).toBe(true)
      expect(wrapper.find('#maker_postal_code').exists()).toBe(true)
      expect(wrapper.find('#maker_address').exists()).toBe(true)
      expect(wrapper.find('#maker_phone_number').exists()).toBe(true)
      expect(wrapper.find('#maker_fax_number').exists()).toBe(true)
      expect(wrapper.find('#maker_email').exists()).toBe(true)
      expect(wrapper.find('#maker_home_page').exists()).toBe(true)
      expect(wrapper.find('#maker_manufacturer_rep').exists()).toBe(true)
    })

    it('ボタンが存在すること', () => {
      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.find('button').text()).toBe('更新')
    })

    it('外部リンクが存在すること', () => {
      expect(wrapper.findComponent({ref: 'linkMakersShow'}).text()).toBe('メーカー情報へ')
      expect(wrapper.findComponent({ref: 'linkMakersShow'}).props().to).toBe('/makers/1')
      expect(wrapper.findComponent({ref: 'linkMakers'}).text()).toBe('メーカーリストへ')
      expect(wrapper.findComponent({ref: 'linkMakers'}).props().to).toBe('/makers')
    })
  })

  describe('API通信', () => {
    describe('メーカー情報の取得に成功した場合', () => {
      it('フォームフィールドにメーカー情報が表示されること', async () => {
        axios.get.mockResolvedValue({
          data: {
            id: 1,
            name: "有限会社中野銀行",
            postal_code: "962-0713",
            address: "東京都渋谷区神南1-2-0",
            phone_number: "070-3288-2552",
            fax_number: "070-2623-8399",
            email: "sample_maker0@example.com",
            home_page: "https://example.com/sample_maker0",
            manufacturer_rep: "宮本 悠斗"
          }
        })

        const wrapper = mount(MakersEditView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.find('#maker_name').element.value).toBe('有限会社中野銀行')
        expect(wrapper.find('#maker_postal_code').element.value).toBe('962-0713')
        expect(wrapper.find('#maker_address').element.value).toBe('東京都渋谷区神南1-2-0')
        expect(wrapper.find('#maker_phone_number').element.value).toBe('070-3288-2552')
        expect(wrapper.find('#maker_fax_number').element.value).toBe('070-2623-8399')
        expect(wrapper.find('#maker_email').element.value).toBe('sample_maker0@example.com')
        expect(wrapper.find('#maker_home_page').element.value).toBe('https://example.com/sample_maker0')
        expect(wrapper.find('#maker_manufacturer_rep').element.value).toBe('宮本 悠斗')
      })
    })

    describe('メーカー情報の取得に失敗した場合', () => {
      it('404ページに遷移すること', async () => {
        axios.get.mockRejectedValue({
          response: {
            status: 404
          }
        })

        const wrapper = mount(MakersEditView, {
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

    describe('有効な情報を入力して送信すると', () => {
      it('更新が成功すること', async () => {
        const mockResponse = {
          data: {
            id: 1,
            name: "有限会社中野銀行",
            postal_code: "962-0713",
            address: "東京都渋谷区神南1-2-0",
            phone_number: "070-3288-2552",
            fax_number: "070-2623-8399",
            email: "sample_maker0@example.com",
            home_page: "https://example.com/sample_maker0",
            manufacturer_rep: "宮本 悠斗"
          }
        }

        axios.get.mockResolvedValue(mockResponse)
        axios.patch.mockResolvedValue(mockResponse)
        
        const wrapper = mount(MakersEditView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.find('#maker_name').element.value).toBe('有限会社中野銀行')
        expect(wrapper.find('#maker_postal_code').element.value).toBe('962-0713')
        expect(wrapper.find('#maker_address').element.value).toBe('東京都渋谷区神南1-2-0')
        expect(wrapper.find('#maker_phone_number').element.value).toBe('070-3288-2552')
        expect(wrapper.find('#maker_fax_number').element.value).toBe('070-2623-8399')
        expect(wrapper.find('#maker_email').element.value).toBe('sample_maker0@example.com')
        expect(wrapper.find('#maker_home_page').element.value).toBe('https://example.com/sample_maker0')
        expect(wrapper.find('#maker_manufacturer_rep').element.value).toBe('宮本 悠斗')

        await wrapper.find('form').trigger('submit.prevent')

        expect(wrapper.emitted()).toHaveProperty('message')
        expect(wrapper.emitted().message[0]).toEqual([
          { type: 'success', text: 'メーカー情報を更新しました。' }
        ])
        expect(pushMock).toHaveBeenCalledWith('/makers/1')
      })
    })

    describe('空の状態で送信すると', () => {
      it('更新が失敗すること', async () => {
        axios.patch.mockRejectedValue(new Error('Validation error'))

        const wrapper = mount(MakersEditView, {
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
})
