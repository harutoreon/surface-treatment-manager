import UsersShowView from '@/components/users/UsersShowView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const replaceMock = vi.fn()
const pushMock = vi.fn()

vi.mock('axios')
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
  let wrapper

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      axios.get.mockResolvedValue({
        data: {
          id: 1,
          name: '渡辺 陸斗',
          department: '開発部'
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
      
    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('ユーザー情報')
    })

    it('ユーザー情報が表示されること', async () => {  
      // ユーザー名
      expect(wrapper.text()).toContain('渡辺 陸斗')
      
      // 部署名
      expect(wrapper.text()).toContain('開発部')
    })

    it('外部リンクが表示されること', () => {
      const linkUsersEdit = wrapper.findComponent({ ref: 'linkUsersEdit' })
      const linkUsers = wrapper.findComponent({ ref: 'linkUsers' })

      // to属性
      expect(linkUsersEdit.props().to).toBe('/users/1/edit')
      expect(linkUsers.props().to).toBe('/users')

      // テキスト
      expect(linkUsersEdit.text()).toBe('ユーザー情報の編集')
      expect(linkUsers.text()).toBe('ユーザーリスト')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 404
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

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: 'ユーザー情報の取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('ユーザー情報の削除に成功した場合', () => {
    it('ユーザーリストページに遷移すること', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true)

      axios.get.mockResolvedValue({
        data: {
          id: 1
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

      wrapper = mount(UsersShowView, {
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
