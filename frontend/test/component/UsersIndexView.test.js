import { mount } from '@vue/test-utils'
import UsersIndexView from '@/components/UsersIndexView.vue'
import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'

vi.mock('vue-router', () => ({
    useRoute: () => ({
    query: { page: '1' }
  })
}))

describe('UsersIndexView', () => {
  describe('コンポーネントのレンダリング', () => {
    it('見出し「ユーザーリスト」が表示されること', () => {
      const wrapper = mount(UsersIndexView, {
        global: {
          stubs: {
            RouterLink: true
          }
        }
      })

      expect(wrapper.find('h3').text()).toBe('ユーザーリスト')
    })

    it('ユーザーが10件表示されること', async () => {
      vi.spyOn(axios, 'get').mockResolvedValue({
        data: {
          users: [
            { id: 1, name: 'test_user1', department: '品質管理部' },
            { id: 2, name: 'test_user2', department: '製造部' },
            { id: 3, name: 'test_user3', department: '営業部' },
            { id: 4, name: 'test_user4', department: '品質管理部' },
            { id: 5, name: 'test_user5', department: '製造部' },
            { id: 6, name: 'test_user6', department: '営業部' },
            { id: 7, name: 'test_user7', department: '品質管理部' },
            { id: 8, name: 'test_user8', department: '製造部' },
            { id: 9, name: 'test_user9', department: '営業部' },
            { id: 10, name: 'test_user10', department: '生産管理部' }
          ],
        }
      })

      const wrapper = mount(UsersIndexView, {
        global: {
          stubs: {
            RouterLink: true
          }
        }
      })

      await wrapper.vm.$nextTick()

      const userItems = wrapper.findAll('.list-group-item-action')
      expect(userItems.length).toBe(10)
    })

    it('ページネーションが表示されること', () => {
      const wrapper = mount(UsersIndexView, {
        global: {
          stubs: {
            RouterLink: {
              props: ['to'],
              template: '<a :href="to"><slot /></a>'
            }
          }
        }
      })

      const pagination = wrapper.findAll('.page-link')

      expect(pagination[0].element.textContent).toBe('前ページ')
      expect(pagination[1].element.textContent).toBe('1')
      expect(pagination[2].element.textContent).toBe('次ページ')
    })
  })
})
