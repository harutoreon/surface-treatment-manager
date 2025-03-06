import { mount } from '@vue/test-utils'
import UsersShowView from '@/components/UsersShowView.vue'
import axios from 'axios'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '1' }
  }),
  useRouter: () => ({
    push: vi.fn()
  })
}))

vi.mock('axios')

describe('UsersShowView', () => {
  let wrapper

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        name: 'test_user',
        department: 'sample_department'
      }
    })
    wrapper = mount(UsersShowView, {
      global: {
        stubs: {
          RouterLink: {
            props: ['to'],
            template:'<a v-bind:href="to"><slot /></a>'
          }
        }
      }
    })  
  })

  describe('コンポーネントのレンダリング', () => {
    it('見出し「ユーザー情報」が表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('ユーザー情報')
    })

    it('ユーザー名と部署名が表示されること', async () => {  
      await wrapper.vm.$nextTick()
      const elements = wrapper.findAll('.list-group-item')
  
      expect(elements[0].find('div:nth-child(2)').text()).toBe('test_user')
      expect(elements[1].find('div:nth-child(2)').text()).toBe('sample_department')
    })

    it('RouterLinkのto属性が/usersであること', () => {
      const links = wrapper.findAll('a')

      expect(links[1].attributes('href')).toBe('/users')
    })
  })
})
