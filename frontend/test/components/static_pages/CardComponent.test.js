import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import CardComponent from '@/components/static_pages/CardComponent.vue'

describe('CardComponent', () => {
  it('各 props が反映されること', () => {
    const props = {
      id: 'search-name',
      alt: 'experiment icon',
      icon: 'experimentIcon',
      cardTitle: '処理名で検索',
      cardText: '処理名を入力して表面処理を検索します。',
      toAttribute: '/static_pages/name',
      linkText: '検索ページへ'
    }
    const wrapper = mount(CardComponent, {
      props,
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    expect(wrapper.find('#search-name').exists()).toBe(true)
    expect(wrapper.find('img').attributes('alt')).toBe(props.alt)
    expect(wrapper.find('img').attributes('src')).toBe(props.icon)
    expect(wrapper.find('.card-title').text()).toBe(props.cardTitle)
    expect(wrapper.find('.card-text').text()).toBe(props.cardText)
    expect(wrapper.findComponent(RouterLinkStub).props().to).toBe(props.toAttribute)
    expect(wrapper.findComponent(RouterLinkStub).text()).toBe(props.linkText)
  })
})
