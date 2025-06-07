import UsersIndexView from '@/components/users/UsersIndexView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

vi.mock('axios')

const replacdMock = vi.fn()

vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        query: { page: 1 }
      }
    },
    useRouter: () => {
      return {
        replace: replacdMock
      }
    }
  }
})

describe('UsersIndexView', () => {
  describe('DOMの構造', () => {
    let wrapper

    beforeEach(async () => {
      axios.get.mockResolvedValue({
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
          current_page: 1,
          total_pages: 1
        }
      })

      wrapper = mount(UsersIndexView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出しが存在すること', () => {
      expect(wrapper.find('h3').text()).toBe('ユーザーリスト')
    })

    it('ユーザーが10件表示されること', async () => {
      const userItems = wrapper.findAll('.list-group-item-action')
      expect(userItems.length).toBe(10)
    })

    it('ページネーションが存在すること', () => {
      expect(wrapper.text()).toContain('前ページ')
      expect(wrapper.text()).toContain('次ページ')
    })

    it('RouterLinkにto属性が設定されていること', () => {
      expect(wrapper.findComponent({ ref: 'linkUsersNew' }).props().to).toBe('/users/new')
      expect(wrapper.findComponent({ ref: 'linkHome' }).props().to).toBe('/home')
    })
  })

  describe('API通信', () => {
    describe('ユーザーリストの取得に成功した場合', () => {
      it('ユーザー名が表示されること', async () => {
        axios.get.mockResolvedValue({
          data: {
            users: [
              { id: 1, name: 'test_user1' },
              { id: 2, name: 'test_user2' },
              { id: 3, name: 'test_user3' },
              { id: 4, name: 'test_user4' },
              { id: 5, name: 'test_user5' },
              { id: 6, name: 'test_user6' },
              { id: 7, name: 'test_user7' },
              { id: 8, name: 'test_user8' },
              { id: 9, name: 'test_user9' },
              { id: 10, name: 'test_user10' }
            ],
          }
        })

        const wrapper = mount(UsersIndexView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.text()).toContain('test_user1')
        expect(wrapper.text()).toContain('test_user2')
        expect(wrapper.text()).toContain('test_user3')
        expect(wrapper.text()).toContain('test_user4')
        expect(wrapper.text()).toContain('test_user5')
        expect(wrapper.text()).toContain('test_user6')
        expect(wrapper.text()).toContain('test_user7')
        expect(wrapper.text()).toContain('test_user8')
        expect(wrapper.text()).toContain('test_user9')
        expect(wrapper.text()).toContain('test_user10')
      })
    })

    describe('ユーザーリストの取得に失敗した場合', () => {
      it('404ページに遷移すること', async () => {
        axios.get.mockRejectedValue({
          response: {
            status: 404
          }
        })

        const wrapper = mount(UsersIndexView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.emitted()).toHaveProperty('message')
        expect(wrapper.emitted().message[0]).toEqual([
          { type: 'danger', text: 'ユーザーリストの取得に失敗しました。' }
        ])
        expect(replacdMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })
})
