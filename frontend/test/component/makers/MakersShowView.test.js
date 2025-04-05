import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MakersShowView from '@/components/makers/MakersShowView.vue'
import axios from 'axios'

vi.mock('axios')

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: '1'
    }
  })
}))

describe('MakersShowView', () => {
  let wrapper

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: { 
        name: '有限会社中野銀行',
        postal_code: '962-0713',
        address: '東京都渋谷区神南1-2-0',
        phone_number: '070-3288-2552',
        fax_number: '070-2623-8399',
        email: 'sample_maker0@example.com',
        home_page: 'https://example.com/sample_maker0',
        manufacturer_rep: '宮本 悠斗'
      }})

    wrapper = mount(MakersShowView)
  })

  describe('コンポーネントのレンダリング', () => {
    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('メーカー情報')
    })

    it('メーカー情報が表示されること', () => {
      expect(wrapper.find('div[id="maker-name"]').text()).toBe('有限会社中野銀行')
      expect(wrapper.find('div[id="postal-code"]').text()).toBe('962-0713')
      expect(wrapper.find('div[id="address"]').text()).toBe('東京都渋谷区神南1-2-0')
      expect(wrapper.find('div[id="phone-number"]').text()).toBe('070-3288-2552')
      expect(wrapper.find('div[id="fax-number"]').text()).toBe('070-2623-8399')
      expect(wrapper.find('div[id="email-address"]').text()).toBe('sample_maker0@example.com')
      expect(wrapper.find('div[id="home-page-address"]').text()).toBe('https://example.com/sample_maker0')
      expect(wrapper.find('div[id="person-in-charge"]').text()).toBe('宮本 悠斗')
    })

    it('外部リンクが表示されること', () => {
      expect(wrapper.find('a[id="maker-edit"]').text()).toBe('メーカー情報の編集へ')
      expect(wrapper.find('a[id="maker-destroy"]').text()).toBe('メーカー情報の削除')
      expect(wrapper.find('a[id="maker-list"]').text()).toBe('メーカーリストへ')
    })
  })
})
