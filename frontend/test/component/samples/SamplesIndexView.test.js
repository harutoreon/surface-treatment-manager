import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SamplesIndexView from '@/components/samples/SamplesIndexView.vue'

describe('SamplesIndexView', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(SamplesIndexView)  
  })

  describe('DOMの構造', () => {
    it('見出しが存在すること', () => {
      expect(wrapper.find('h3').text()).toBe('表面処理リスト')
    })

    it('項目のラベルが存在すること', () => {
      expect(wrapper.find('#label_name_and_category').text()).toBe('処理名 / カテゴリー')
      expect(wrapper.find('#label_maker_name').text()).toBe('メーカー名')
    })
    
    it('リストが8件表示されること', () => {
      const links = wrapper.findAll('a[href="/samples/#"]')
      expect(links.length).toBe(8)
    })

    it('ページネーションが存在すること', () => {
      expect(wrapper.find('.pagination').exists()).toBe(true)
      expect(wrapper.find('#previous_page').text()).toBe('前のページ')
      expect(wrapper.find('#next_page').text()).toBe('次のページ')
    })

    it('外部リンクが存在すること', () => {
      expect(wrapper.find('a[href="/samples/new"]').text()).toBe('表面処理情報の登録')
      expect(wrapper.find('a[href="/home"]').text()).toBe('メインメニューへ')
    })
  })
})
