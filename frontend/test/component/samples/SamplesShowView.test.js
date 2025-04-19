import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SamplesShowView from '@/components/samples/SamplesShowView.vue'
import axios from 'axios'

vi.mock('axios')

vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        params: { id: 1 }
      }
    }
  }
})

axios.get.mockReturnValue({
  data: {
    "id": 1,
    "name": "無電解ニッケルめっき",
    "category": "めっき",
    "color": "イエローブラウンシルバー",
    "maker": "小島印刷合同会社",
    "created_at": "2025-02-23T22:15:29.815Z",
    "updated_at": "2025-02-23T22:15:29.815Z",
    "picture": "#<File:0x0000ffff859a8be0>",
    "hardness": "析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度",
    "film_thickness": "通常は3～5μm、厚めの場合は20～50μmまで可能",
    "feature": "耐食性・耐摩耗性・耐薬品性・耐熱性"
  }
})

describe('SamplesShowView', () => {
  describe('DOMの構造', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(SamplesShowView)
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('表面処理情報')
    })

    it('表面処理情報のラベルが表示されること', () => {
      expect(wrapper.find('#label_sample_name').text()).toBe('処理名：')
      expect(wrapper.find('#label_sample_category').text()).toBe('カテゴリー：')
      expect(wrapper.find('#label_sample_color').text()).toBe('色調：')
      expect(wrapper.find('#label_sample_maker').text()).toBe('メーカー：')
      expect(wrapper.find('#label_sample_hardness').text()).toBe('硬度：')
      expect(wrapper.find('#label_sample_film_thickness').text()).toBe('膜厚：')
      expect(wrapper.find('#label_sample_feature').text()).toBe('特徴：')
      expect(wrapper.find('#label_sample_picture').text()).toBe('画像：')
    })

    it('表面処理情報が存在すること', () => {
      expect(wrapper.find('#sample_name').exists()).toBe(true)
      expect(wrapper.find('#sample_category').exists()).toBe(true)
      expect(wrapper.find('#sample_color').exists()).toBe(true)
      expect(wrapper.find('#sample_maker').exists()).toBe(true)
      expect(wrapper.find('#sample_hardness').exists()).toBe(true)
      expect(wrapper.find('#sample_film_thickness').exists()).toBe(true)
      expect(wrapper.find('#sample_feature').exists()).toBe(true)
      expect(wrapper.find('#sample_picture').exists()).toBe(true)
    })

    it('コメントのラベルが表示されること', () => {
      expect(wrapper.find('#label_commenter').text()).toBe('部署名 / 投稿者 / コメント')
      expect(wrapper.find('#label_create_at').text()).toBe('投稿日')
    })

    it('外部リンクが表示されること', () => {
      expect(wrapper.find('#link_sample_edit').text()).toBe('表面処理情報の編集')
      expect(wrapper.find('#link_sample_destroy').text()).toBe('表面処理情報の削除')
      expect(wrapper.find('#link_home').text()).toBe('メインメニューへ')
    })
  })
})
