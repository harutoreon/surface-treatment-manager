import DepartmentsShowView from '@/components/departments/DepartmentsShowView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
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

describe('DepartmentsShowView', () => {
  let wrapper

  describe('ログインチェックに成功した場合', () => {
    it('部署情報ページに移動すること', async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            name: '品質管理部'
          }
        })

      wrapper = mount(DepartmentsShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('部署情報')
    })
  })

  describe('ログインチェックに失敗した場合', () => {
    it('ログインページに移動すること', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 401
        }
      })

      wrapper = mount(DepartmentsShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: 'ログインが必要です。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/')

      const id = 1
      expect(pushMock).not.toHaveBeenCalledWith(`/departments/${id}`)
    })
  })

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            name: '品質管理部'
          }
        })

      wrapper = mount(DepartmentsShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('部署情報')
    })

    it('部署名が表示されること', () => {
      const departmentInfoItem = wrapper.find('.list-group-item')

      expect(departmentInfoItem.text()).toContain('部署名 :')
      expect(departmentInfoItem.text()).toContain('品質管理部')
    })

    it('外部リンクが表示されること', () => {
      const routerLinks = wrapper.findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLinks[0].props().to).toBe('/departments/1/edit')
      expect(routerLinks[1].props().to).toBe('/departments')

      // テキスト
      expect(routerLinks[0].text()).toBe('部署情報の編集へ')
      expect(routerLinks[1].text()).toBe('部署リストへ')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockRejectedValueOnce({
          response: {
            status: 404
          }
        })

      wrapper = mount(DepartmentsShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: '部署情報の取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('削除処理に成功した場合', () => {
    beforeEach(async () => {
      window.confirm = vi.fn()
      vi.spyOn(window, 'confirm').mockReturnValue(true)

      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            name: '品質管理部'
          }
        })

      wrapper = mount(DepartmentsShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('部署リストページに遷移すること', async () => {
      await wrapper.find('button').trigger('click')
      
      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'success', text: '部署情報を1件削除しました。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/departments')      
    })
  })

  describe('削除処理に失敗した場合', () => {
    beforeEach(async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true)

      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            name: '品質管理部'
          }
        })

      axios.delete.mockRejectedValue({
        response: {
          status: 404
        }
      })

      wrapper = mount(DepartmentsShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('404ページに遷移すること', async () => {
      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: '削除処理に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })

    })
  })
})