import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MakersIndexView from '@/components/makers/MakersIndexView.vue'

describe('MakersIndexView', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(MakersIndexView)
  })

  describe('コンポーネントのレンダリング', () => {
    it('見出し「メーカーリスト」が表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('メーカーリスト')
    })
  
    it('ラベル「メーカー名 / 住所」と「電話番号 / FAX番号」が表示されること', () => {
      const labels = wrapper.findAll('h6')
  
      expect(labels[0].text()).toBe('メーカー名 / 住所')
      expect(labels[1].text()).toBe('電話番号 / FAX番号')
    })
  
    it('ページネーションの「前のページ」と「次のページ」のリンクが表示されること', () => {
      const links = wrapper.findAll('a[class="page-link"]')

      expect(links[0].text()).toBe('前のページ')
      expect(links[14].text()).toBe('次のページ')
    })

    it('外部リンク「メーカー情報の登録」と「メインメニュー」が表示されること', () => {
      const links = wrapper.findAll('a')

      expect(links[22].text()).toBe('メーカー情報の登録')
      expect(links[23].text()).toBe('メインメニューへ')
    })
  })  
})
