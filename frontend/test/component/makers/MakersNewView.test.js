import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MakersNewView from '@/components/makers/MakersNewView.vue'
import axios from 'axios'
import router from '@/router'

vi.mock('axios')

vi.mock('@/router', () => {
  return {
    default: {
      push: vi.fn()
    }
  }
})

describe('MakersNewView', () => {
  it('見出しが表示されること', () => {
    const wrapper = mount(MakersNewView)

    expect(wrapper.find('h3').text()).toBe('メーカー情報の登録')
  })

  it('入力フォームが表示されること', () => {
    const wrapper = mount(MakersNewView)

    expect(wrapper.find('form').exists()).toBe(true)

    expect(wrapper.find('label[for="maker_name"]').text()).toBe('メーカー名')
    expect(wrapper.find('input[id="maker_name"]').exists()).toBe(true)

    expect(wrapper.find('label[for="maker_postal_code"]').text()).toBe('郵便番号')
    expect(wrapper.find('input[id="maker_postal_code"]').exists()).toBe(true)

    expect(wrapper.find('label[for="maker_address"]').text()).toBe('住所')
    expect(wrapper.find('input[id="maker_address"]').exists()).toBe(true)

    expect(wrapper.find('label[for="maker_phone_number"]').text()).toBe('電話番号')
    expect(wrapper.find('input[id="maker_phone_number"]').exists()).toBe(true)

    expect(wrapper.find('label[for="maker_fax_number"]').text()).toBe('FAX番号')
    expect(wrapper.find('input[id="maker_fax_number"]').exists()).toBe(true)

    expect(wrapper.find('label[for="maker_email"]').text()).toBe('Email')
    expect(wrapper.find('input[id="maker_email"]').exists()).toBe(true)

    expect(wrapper.find('label[for="maker_home_page"]').text()).toBe('ホームページ')
    expect(wrapper.find('input[id="maker_home_page"]').exists()).toBe(true)

    expect(wrapper.find('label[for="maker_manufacturer_rep"]').text()).toBe('担当者')
    expect(wrapper.find('input[id="maker_manufacturer_rep"]').exists()).toBe(true)

    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('外部リンクが表示されること', () => {
    const wrapper = mount(MakersNewView)

    expect(wrapper.find('a').text()).toBe('メーカーリストへ')
  })

  it('有効な情報を入力した場合は登録が成功すること', async () => {
    const mockMaker = {
      data: {
        maker: {
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
    }

    axios.post.mockResolvedValue(mockMaker)

    const wrapper = mount(MakersNewView)

    const nameInput = wrapper.find('input[id="maker_name"]')
    const postalCodeInput = wrapper.find('input[id="maker_postal_code"]')
    const addressInput = wrapper.find('input[id="maker_address"]')
    const phoneNumberInput = wrapper.find('input[id="maker_phone_number"]')
    const faxNumberInput = wrapper.find('input[id="maker_fax_number"]')
    const emailInput = wrapper.find('input[id="maker_email"]')
    const homePageInput = wrapper.find('input[id="maker_home_page"]')
    const manufacturerRepInput = wrapper.find('input[id="maker_manufacturer_rep"]')
    
    await nameInput.setValue('有限会社中野銀行')
    await postalCodeInput.setValue('962-0713')
    await addressInput.setValue('東京都渋谷区神南1-2-0')
    await phoneNumberInput.setValue('070-3288-2552')
    await faxNumberInput.setValue('070-2623-8399')
    await emailInput.setValue('sample_maker0@example.com')
    await homePageInput.setValue('https://example.com/sample_maker0')
    await manufacturerRepInput.setValue('宮本 悠斗')
    await wrapper.find('form').trigger('submit.prevent')

    expect(router.push).toHaveBeenCalledWith(`/makers/${mockMaker.id}`)
  })

  it('無効な情報を入力した場合は登録が失敗すること', async () => {
    axios.post.mockRejectedValue(new Error('Invalid credentials'))

    const wrapper = mount(MakersNewView)

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('入力に不備があります。')
  })
})
