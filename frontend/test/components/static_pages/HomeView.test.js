import { mount } from '@vue/test-utils'
import HomeView from '@/components/static_pages/HomeView.vue'
import { describe, it, expect, beforeEach } from 'vitest'

import experimentIcon from '@/assets/icons/experiment.svg'
import categoryIcon from '@/assets/icons/category.svg'
import factoryIcon from '@/assets/icons/factory.svg'
import listIcon from '@/assets/icons/list.svg'
import libraryAddIcon from '@/assets/icons/library_add.svg'
import categoryAddIcon from '@/assets/icons/category_add.svg'
import makerAddIcon from '@/assets/icons/maker_add.svg'
import userAddIcon from '@/assets/icons/user_add.svg'
import settingsIcon from '@/assets/icons/settings.svg'

describe('HomeView', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(HomeView, {
      global: {
        stubs: {
          RouterLink: {
            props: ['to'],
            template: '<a :href="to"><slot /></a>'
          }
        }
      }
    })
  })

  describe('Component rendering', () => {
    it('見出し「メインメニュー」が表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('メインメニュー')
    })

    it('カードの数が9個あること', () => {
      const cards = wrapper.findAll('.card')
      expect(cards.length).toBe(9)
    })

    it('各カードにタイトルがあること', () => {
      const cards = wrapper.findAll('.card-title')

      expect(cards[0].text()).toBe('処理名で検索')
      expect(cards[1].text()).toBe('カテゴリーで検索')
      expect(cards[2].text()).toBe('メーカー名で検索')
      expect(cards[3].text()).toBe('処理一覧から検索')
      expect(cards[4].text()).toBe('表面処理の管理')
      expect(cards[5].text()).toBe('カテゴリーの管理')
      expect(cards[6].text()).toBe('メーカーの管理')
      expect(cards[7].text()).toBe('ユーザーの管理')
      expect(cards[8].text()).toBe('アプリケーションの管理')
    })
  })

  describe('リンク要素', () => {
    it('RouterLinkにto属性が設定されていること', () => {
      expect(wrapper.findComponent({ ref: "linkSearchName" }).props().to).toBe('/static_pages/name')
      expect(wrapper.findComponent({ ref: "linkSearchCategory" }).props().to).toBe('/static_pages/category')
      expect(wrapper.findComponent({ ref: "linkSearchMaker" }).props().to).toBe('/static_pages/maker')
      expect(wrapper.findComponent({ ref: "linkSearchList" }).props().to).toBe('/list_search_results')
      expect(wrapper.findComponent({ ref: "linkManageSamples" }).props().to).toBe('/samples')
      expect(wrapper.findComponent({ ref: "linkManageCategories" }).props().to).toBe('/categories')
      expect(wrapper.findComponent({ ref: "linkManageMakers" }).props().to).toBe('/makers')
      expect(wrapper.findComponent({ ref: "linkManageUsers" }).props().to).toBe('/users')
      expect(wrapper.findComponent({ ref: "linkSettings" }).props().to).toBe('/settings')
    })
  })

  describe('Icon display', () => {
    it('アイコンが9個あること', () => {
      const icons = wrapper.findAll('img')
      expect(icons.length).toBe(9)
    })

    it('各アイコンのsrc属性が間違っていないこと', () => {
      const icons = wrapper.findAll('img')

      expect(icons[0].attributes('src')).toBe(experimentIcon)
      expect(icons[1].attributes('src')).toBe(categoryIcon)
      expect(icons[2].attributes('src')).toBe(factoryIcon)
      expect(icons[3].attributes('src')).toBe(listIcon)
      expect(icons[4].attributes('src')).toBe(libraryAddIcon)
      expect(icons[5].attributes('src')).toBe(categoryAddIcon)
      expect(icons[6].attributes('src')).toBe(makerAddIcon)
      expect(icons[7].attributes('src')).toBe(userAddIcon)
      expect(icons[8].attributes('src')).toBe(settingsIcon)
    })

    it('各アイコンにalt属性が設定されていること', () => {
      const icons = wrapper.findAll('img')

      expect(icons[0].attributes('alt')).toBe('experiment icon')
      expect(icons[1].attributes('alt')).toBe('category icon')
      expect(icons[2].attributes('alt')).toBe('factory icon')
      expect(icons[3].attributes('alt')).toBe('list icon')
      expect(icons[4].attributes('alt')).toBe('library add icon')
      expect(icons[5].attributes('alt')).toBe('category add icon')
      expect(icons[6].attributes('alt')).toBe('maker add icon')
      expect(icons[7].attributes('alt')).toBe('user add icon')
      expect(icons[8].attributes('alt')).toBe('settings icon')
    })
  })
})
