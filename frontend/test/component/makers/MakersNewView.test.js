import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MakersNewView from '@/components/makers/MakersNewView.vue'

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
})
