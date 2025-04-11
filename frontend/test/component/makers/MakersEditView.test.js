import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MakersEditView from '@/components/makers/MakersEditView.vue'

describe('MakersEditView', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(MakersEditView)
  })

  describe('初期レンダリング', () => {
    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('メーカー情報の編集')
    })

    it('フォームが表示されること', () => {
      expect(wrapper.find('form').exists()).toBe(true)
    })

    it('すべてのラベルが表示されること', () => {
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

    it('すべてのフォームフィールドが表示されること', () => {
      expect(wrapper.find('#maker_name').exists()).toBe(true)
      expect(wrapper.find('#maker_postal_code').exists()).toBe(true)
      expect(wrapper.find('#maker_address').exists()).toBe(true)
      expect(wrapper.find('#maker_phone_number').exists()).toBe(true)
      expect(wrapper.find('#maker_fax_number').exists()).toBe(true)
      expect(wrapper.find('#maker_email').exists()).toBe(true)
      expect(wrapper.find('#maker_home_page').exists()).toBe(true)
      expect(wrapper.find('#maker_manufacturer_rep').exists()).toBe(true)
    })

    it('ボタンが表示されること', () => {
      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.find('button').text()).toBe('更新')
    })

    it('外部リンクが表示されること', () => {
      expect(wrapper.find('a').exists()).toBe(true)
      expect(wrapper.find('a').text()).toBe('メーカーリストへ')
    })
  })
})
