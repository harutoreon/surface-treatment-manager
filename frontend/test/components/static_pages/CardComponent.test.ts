import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import CardComponent from '@/components/static_pages/CardComponent.vue'
import type { Props } from '@/components/static_pages/CardComponent.vue'
import type { VueWrapper } from '@vue/test-utils'

describe('CardComponent', (): void => {
  it('各 props が反映されること', (): void => {
    const props: Props = {
      id: 'search-name',
      alt: 'experiment icon',
      icon: 'experimentIcon',
      cardTitle: '処理名で検索',
      cardText: '処理名を入力して表面処理を検索します。',
      toAttribute: '/static_pages/name',
      linkText: '検索ページへ'
    }
    const wrapper: VueWrapper = mount(CardComponent, {
      props,
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    expect.soft(wrapper.find('#search-name').exists()).toBe(true)
    expect.soft(wrapper.find('img').attributes('alt')).toBe(props.alt)
    expect.soft(wrapper.find('img').attributes('src')).toBe(props.icon)
    expect.soft(wrapper.find('.card-title').text()).toBe(props.cardTitle)
    expect.soft(wrapper.find('.card-text').text()).toBe(props.cardText)
    expect.soft(wrapper.findComponent(RouterLinkStub).props().to).toBe(props.toAttribute)
    expect.soft(wrapper.findComponent(RouterLinkStub).text()).toBe(props.linkText)
  })
})
