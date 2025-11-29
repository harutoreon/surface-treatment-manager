import CommentsShowView from '@/components/comments/CommentsShowView.vue'
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

describe('CommentsShowView', () => {
  let wrapper

  describe('ログインチェックに成功した場合', () => {
    it('コメント情報ページに移動すること', async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            commenter: '工藤 琴音',
            body: '製品に高級感を与える仕上がりで、見た目も美しいです。',
            sample_id: 16,
            department: '品質管理部'
          }
        })

      wrapper = mount(CommentsShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('コメント情報')
    })
  })

  describe('ログインチェックに失敗した場合', () => {
    it('ログインページに移動すること', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 401
        }
      })

      wrapper = mount(CommentsShowView, {
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
      expect(pushMock).not.toHaveBeenCalledWith(`/comments/${id}`)
    })
  })

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      const adminUserId = 49

      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            payload: { user_id: adminUserId }
          }
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            commenter: '工藤 琴音',
            body: '製品に高級感を与える仕上がりで、見た目も美しいです。',
            sample_id: 16,
            department: '品質管理部'
          }
        })

      wrapper = mount(CommentsShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('コメント情報')
    })

    it('コメント情報が表示されること', () => {
      const ulElement = wrapper.find('ul')
      
      // 部署名
      expect(ulElement.text()).toContain('部署名')
      expect(ulElement.text()).toContain('品質管理部')

      // 投稿者
      expect(ulElement.text()).toContain('投稿者')
      expect(ulElement.text()).toContain('工藤 琴音')

      // コメント
      expect(ulElement.text()).toContain('コメント')
      expect(ulElement.text()).toContain('製品に高級感を与える仕上がりで、見た目も美しいです。')
    })

    it('外部リンクが表示されること', () => {
      const routerLinks = wrapper.findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLinks[0].props().to).toBe('/comments/1/edit')
      expect(routerLinks[1].props().to).toBe('/comments')
      expect(routerLinks[2].props().to).toBe('/samples/16')

      // テキスト
      expect(routerLinks[0].text()).toBe('コメント情報の編集')
      expect(routerLinks[1].text()).toBe('コメントリストへ')
      expect(routerLinks[2].text()).toBe('表面処理情報へ')
    })

    it('コメント情報の削除ボタンが表示されること', () => {
      expect(wrapper.find('button').text()).toBe('コメント情報の削除')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    beforeEach(async () => {
      const adminUserId = 49

      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            payload: { user_id: adminUserId }
          }
        })
        .mockRejectedValueOnce({
          response: {
            status: 404
          }
        })

      wrapper = mount(CommentsShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('404ページに遷移すること', () => {
      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: 'コメント情報の取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('コメント情報の削除で「はい」を押した場合', () => {
    beforeEach(async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true)

      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            commenter: '工藤 琴音',
            body: '製品に高級感を与える仕上がりで、見た目も美しいです。',
            sample_id: 16,
            department: '品質管理部'
          }
        })

      wrapper = mount(CommentsShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('削除処理が実行されること', async () => {
      await wrapper.find('button').trigger('click')
      
      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'success', text: 'コメント情報を1件削除しました。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/comments') 
    })
  })

  describe('コメント情報の削除で「キャンセル」を押した場合', () => {
    beforeEach(async () => {
      pushMock.mockClear()

      vi.spyOn(window, 'confirm').mockReturnValue(false)

      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            commenter: '工藤 琴音',
            body: '製品に高級感を与える仕上がりで、見た目も美しいです。',
            sample_id: 16,
            department: '品質管理部'
          }
        })

      wrapper = mount(CommentsShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('削除処理がキャンセルされること', async () => {
      await wrapper.find('button').trigger('click')

      expect(pushMock).not.toHaveBeenCalledWith('/comments')
    })
  })

  describe('コメント情報の削除に失敗した場合', () => {
    beforeEach(async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true)

      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            commenter: '工藤 琴音',
            body: '製品に高級感を与える仕上がりで、見た目も美しいです。',
            sample_id: 16,
            department: '品質管理部'
          }
        })

      axios.delete.mockRejectedValue({
        response: {
          status: 404
        }
      })

      wrapper = mount(CommentsShowView, {
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

  describe('一般ユーザーでログインした場合', () => {
    beforeEach(async () => {
      const generalUserId = 50

      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            payload: { user_id: generalUserId }
          }
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            commenter: '工藤 琴音',
            body: '製品に高級感を与える仕上がりで、見た目も美しいです。',
            sample_id: 16,
            department: '品質管理部'
          }
        })

      wrapper = mount(CommentsShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('コメントリストのリンクは表示されないこと', async () => {
      const routerLinks = wrapper.findAllComponents(RouterLinkStub)
      expect(routerLinks[1].text()).toBe('コメントリストへ')
      expect(routerLinks[1].attributes('style')).toBe('display: none;')
    })

    it('コメント情報の削除リンクは表示されないこと', async () => {
      expect(wrapper.find('button').text()).toBe('コメント情報の削除')
      expect(wrapper.find('button').attributes('style')).toBe('display: none;')
    })
  })
})
