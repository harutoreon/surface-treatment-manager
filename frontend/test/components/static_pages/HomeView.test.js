import HomeView from '@/components/static_pages/HomeView.vue'
import experimentIcon from '@/assets/icons/experiment.svg'
import categoryIcon from '@/assets/icons/category.svg'
import factoryIcon from '@/assets/icons/factory.svg'
import listIcon from '@/assets/icons/list.svg'
// import libraryAddIcon from '@/assets/icons/library_add.svg'
// import categoryAddIcon from '@/assets/icons/category_add.svg'
// import makerAddIcon from '@/assets/icons/maker_add.svg'
// import userAddIcon from '@/assets/icons/user_add.svg'
// import settingsIcon from '@/assets/icons/settings.svg'
import { describe, it, expect, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'

describe('HomeView', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = mount(HomeView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    await flushPromises()
  })

  describe('初期レンダリング', () => {
    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('メインメニュー')
    })

    it('「処理名で検索」のカードが表示されること', () => {
      const divSearchName = wrapper.find('#search-name')

      expect(divSearchName.find('img').attributes('src')).toBe(experimentIcon)
      expect(divSearchName.find('img').attributes('alt')).toBe('experiment icon')
      expect(divSearchName.find('div h5').text()).toBe('処理名で検索')
      expect(divSearchName.find('div p').text()).toBe('処理名を入力して表面処理を検索します。')
      expect(divSearchName.findComponent('div a').text()).toBe('検索ページへ')
      expect(divSearchName.findComponent('div a').props().to).toBe('/static_pages/name')
    })

    it('「カテゴリーで検索」のカードが表示されること', () => {
      const divSearchCategory = wrapper.find('#search-category')

      expect(divSearchCategory.find('img').attributes('src')).toBe(categoryIcon)
      expect(divSearchCategory.find('img').attributes('alt')).toBe('category icon')
      expect(divSearchCategory.find('div h5').text()).toBe('カテゴリーで検索')
      expect(divSearchCategory.find('div p').text()).toBe('カテゴリーを選択して表面処理を検索します。')
      expect(divSearchCategory.findComponent('div a').text()).toBe('検索ページへ')
      expect(divSearchCategory.findComponent('div a').props().to).toBe('/static_pages/category')
    })
    
    it('「メーカー名で検索」のカードが表示されること', () => {
      const divSearchMaker = wrapper.find('#search-maker')

      expect(divSearchMaker.find('img').attributes('src')).toBe(factoryIcon)
      expect(divSearchMaker.find('img').attributes('alt')).toBe('factory icon')
      expect(divSearchMaker.find('div h5').text()).toBe('メーカー名で検索')
      expect(divSearchMaker.find('div p').text()).toBe('メーカー名を入力して表面処理を検索します。')
      expect(divSearchMaker.findComponent('div a').text()).toBe('検索ページへ')
      expect(divSearchMaker.findComponent('div a').props().to).toBe('/static_pages/maker')
    })

    it('「処理一覧から検索」のカードが表示されること', () => {
      const divSearchList = wrapper.find('#search-list')

      expect(divSearchList.find('img').attributes('src')).toBe(listIcon)
      expect(divSearchList.find('img').attributes('alt')).toBe('list icon')
      expect(divSearchList.find('div h5').text()).toBe('処理一覧から検索')
      expect(divSearchList.find('div p').text()).toBe('表面処理一覧から目的の処理を検索します。')
      expect(divSearchList.findComponent('div a').text()).toBe('検索ページへ')
      expect(divSearchList.findComponent('div a').props().to).toBe('/list_search_results')
    })

    // it('「表面処理の管理」のカードが表示されること', () => {

    // })

    // it('「カテゴリーの管理」のカードが表示されること', () => {

    // })

    // it('「メーカーの管理」のカードが表示されること', () => {

    // })

    // it('「ユーザーの管理」のカードが表示されること', () => {

    // })

    // it('「アプリケーションの管理」のカードが表示されること', () => {

    // })
  })
})
