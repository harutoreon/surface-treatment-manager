import UsersShowView from '@/components/UsersShowView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

vi.mock('axios')

const replaceMock = vi.fn()
const pushMock = vi.fn()

vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        params: { id: 1 }
      }
    },
    useRouter: () => {
      return {
        replace: replaceMock,
        push: pushMock
      }
    }
  }
})

describe('UsersShowView', () => {
  describe('コンポーネントのレンダリング', () => {
    let wrapper

    beforeEach(async () => {
      axios.get.mockResolvedValue({
        data: {
          id: 1,
          name: 'test_user',
          department: '製造部'
        }
      })

      wrapper = mount(UsersShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })
      
    it('見出し「ユーザー情報」が表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('ユーザー情報')
    })

    it('ユーザー名と部署名が表示されること', async () => {  
      const elements = wrapper.findAll('.list-group-item')
  
      expect(elements[0].find('div:nth-child(2)').text()).toBe('test_user')
      expect(elements[1].find('div:nth-child(2)').text()).toBe('製造部')
    })

    it('RouterLinkにto属性が設定されていること', () => {
      expect(wrapper.findComponent({ ref: 'linkUsersEdit' }).props().to).toBe('/users/1/edit')
      expect(wrapper.findComponent({ ref: 'linkUsers' }).props().to).toBe('/users')
    })
  })

  describe('API通信', () => {
    describe('ユーザー情報の取得に成功した場合', () => {
      it('ユーザー名と部署名が表示されること', async () => {
        axios.get.mockResolvedValue({
          data: {
            id: 1,
            name: 'test user',
            department: '製造部'
          }
        })

        const wrapper = mount(UsersShowView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.text()).toContain('test user')
        expect(wrapper.text()).toContain('製造部')
      })
    })

    describe('ユーザー情報の取得に失敗した場合', () => {
      it('404ページに遷移すること', async () => {
        axios.get.mockRejectedValue({
          response: {
            status: 404
          }
        })

        const wrapper = mount(UsersShowView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.emitted()).toHaveProperty('message')
        expect(wrapper.emitted().message[0]).toEqual([
          { type: 'danger', text: 'ユーザー情報の取得に失敗しました。' }
        ])
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })

    describe('ユーザー情報の削除に成功した場合', () => {
      it('削除成功のメッセージが表示されユーザーリストページに遷移すること', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)

        axios.get.mockResolvedValue({
          data: {
            id: 1
          }
        })

        const wrapper = mount(UsersShowView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        await wrapper.find('p').trigger('click')

        expect(wrapper.emitted()).toHaveProperty('message')
        expect(wrapper.emitted().message[0]).toEqual([
          { type: 'success', text: 'ユーザー情報を削除しました。' }
        ])
        expect(pushMock).toHaveBeenCalledWith('/users')
      })
    })

    describe('ユーザー情報の削除に失敗した場合', () => {
      it('404ページに遷移すること', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)

        axios.get.mockResolvedValue({
          data: {
            id: 1
          }
        })

        axios.delete.mockRejectedValue({
          response: {
            status: 404
          }
        })

        const wrapper = mount(UsersShowView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        await wrapper.find('p').trigger('click')

        expect(wrapper.emitted()).toHaveProperty('message')
        expect(wrapper.emitted().message[0]).toEqual([
          { type: 'danger', text: 'ユーザー情報の削除に失敗しました。' }
        ])
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })
})
