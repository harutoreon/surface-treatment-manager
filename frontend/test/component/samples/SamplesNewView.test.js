import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SamplesNewView from '@/components/samples/SamplesNewView.vue'

describe('SamplesNewView', () => { 
  describe('DOMの構造', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(SamplesNewView)
    })

    it('見出しが存在すること', () => {
      expect(wrapper.find('h3').exists()).toBe(true)
      expect(wrapper.find('h3').text()).toBe('表面処理情報の登録')
    })

    it('すべてのラベルが存在すること', () => {
      expect(wrapper.find('#label_sample_name').exists()).toBe(true)
      expect(wrapper.find('#label_sample_name').text()).toBe('処理名')

      expect(wrapper.find('#label_sample_category').exists()).toBe(true)
      expect(wrapper.find('#label_sample_category').text()).toBe('カテゴリー')

      expect(wrapper.find('#label_sample_color').exists()).toBe(true)
      expect(wrapper.find('#label_sample_color').text()).toBe('色調')

      expect(wrapper.find('#label_sample_maker').exists()).toBe(true)
      expect(wrapper.find('#label_sample_maker').text()).toBe('メーカー')

      expect(wrapper.find('#label_sample_hardness').exists()).toBe(true)
      expect(wrapper.find('#label_sample_hardness').text()).toBe('硬度')

      expect(wrapper.find('#label_sample_film_thickness').exists()).toBe(true)
      expect(wrapper.find('#label_sample_film_thickness').text()).toBe('膜厚')

      expect(wrapper.find('#label_sample_feature').exists()).toBe(true)
      expect(wrapper.find('#label_sample_feature').text()).toBe('特徴')

      expect(wrapper.find('#label_sample_picture').exists()).toBe(true)
      expect(wrapper.find('#label_sample_picture').text()).toBe('画像')
    })

    it('すべてのテキスト入力が存在すること', () => {
      expect(wrapper.find('#sample_name').exists()).toBe(true)
      expect(wrapper.find('#sample_color').exists()).toBe(true)
      expect(wrapper.find('#sample_maker').exists()).toBe(true)
      expect(wrapper.find('#sample_hardness').exists()).toBe(true)
      expect(wrapper.find('#sample_film_thickness').exists()).toBe(true)
      expect(wrapper.find('#sample_feature').exists()).toBe(true)
    })

    it('ドロップダウンリストが存在すること', () => {
      expect(wrapper.find('#sample_category').exists()).toBe(true)
      expect(wrapper.find('option[value=""]').text()).toBe('')
      expect(wrapper.find('option[value="めっき"]').text()).toBe('めっき')
      expect(wrapper.find('option[value="陽極酸化"]').text()).toBe('陽極酸化')
      expect(wrapper.find('option[value="化成"]').text()).toBe('化成')
      expect(wrapper.find('option[value="コーティング"]').text()).toBe('コーティング')
      expect(wrapper.find('option[value="表面硬化"]').text()).toBe('表面硬化')
    })

    it('画像プレビューが存在すること', () => {
      expect(wrapper.find('#preview_image').exists()).toBe(true)
    })

    it('ファイル選択が存在すること', () => {
      expect(wrapper.find('#sample_picture').exists()).toBe(true)
    })

    it('ボタンが存在すること', () => {
      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.find('button').text()).toBe('登録')
    })

    it('外部リンクが存在すること', () => {
      expect(wrapper.find('a').exists()).toBe(true)
      expect(wrapper.find('a').text()).toBe('表面処理リストへ')
    })
  })
})