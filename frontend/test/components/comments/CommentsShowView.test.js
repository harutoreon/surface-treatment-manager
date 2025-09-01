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

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      axios.get.mockResolvedValue({
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
      const div = wrapper.find('div[class="d-flex justify-content-evenly"]')
      const routerLinks = div.findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLinks[0].props().to).toBe('/comments/1/edit')
      expect(routerLinks[1].props().to).toBe('/comments')

      // テキスト
      expect(routerLinks[0].text()).toBe('コメント情報の編集')
      expect(routerLinks[1].text()).toBe('コメントリストへ')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    beforeEach(async () => {
      axios.get.mockRejectedValue({
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

      axios.get.mockResolvedValue({
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
      await wrapper.find('p').trigger('click')
      
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
      await wrapper.find('p').trigger('click')

      expect(pushMock).not.toHaveBeenCalledWith('/comments')
    })
  })

  describe('コメント情報の削除に失敗した場合', () => {
    beforeEach(async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true)

      axios.get.mockResolvedValue({
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
      await wrapper.find('p').trigger('click')

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: '削除処理に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })
})
