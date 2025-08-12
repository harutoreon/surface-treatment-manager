import CommentsEditView from '@/components/comments/CommentsEditView.vue'
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

describe('CommentsEditView', () => {
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

      wrapper = mount(CommentsEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('コメント情報の編集')
    })

    it('入力フォームが表示されること', () => {
      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      expect(wrapper.find('label[for="commenter"]').text()).toBe('投稿者')
      expect(wrapper.find('label[for="department"]').text()).toBe('部署名')
      expect(wrapper.find('label[for="body"]').text()).toBe('コメント')

      // 入力要素
      expect(wrapper.find('#commenter').element.value).toBe('工藤 琴音')
      expect(wrapper.find('#department').element.value).toBe('品質管理部')
      
      // テキストエリア要素
      expect(wrapper.find('#body').element.value).toBe(
        '製品に高級感を与える仕上がりで、見た目も美しいです。'
      )

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('更新')
    })

    it('外部リンクが表示されること', () => {
      const routerLink = wrapper.findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLink[0].props().to).toBe('/comments/1')
      expect(routerLink[1].props().to).toBe('/comments')

      // テキスト
      expect(routerLink[0].text()).toBe('コメント情報へ')
      expect(routerLink[1].text()).toBe('コメントリストへ')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    beforeEach(async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 404
        }
      })

      wrapper = mount(CommentsEditView, {
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

  describe('更新に成功した場合', () => {
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

      axios.patch.mockResolvedValue({
        data: {
          id: 1,
          commenter: '工藤 琴音',
          body: '製品に高級感を与える仕上がりで、品質も良好です。',
          sample_id: 16,
          department: '品質管理部'
        }
      })

      wrapper = mount(CommentsEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('コメント情報ページに遷移すること', async () => {
      await wrapper.find('#body').setValue('製品に高級感を与える仕上がりで、品質も良好です。')
      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'success', text: 'コメント情報を更新しました。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/comments/1')
    })
  })

  describe('更新に失敗した場合', () => {
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

      axios.patch.mockRejectedValue({
        response: {
          status: 422
        }
      })

      wrapper = mount(CommentsEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('入力不備のメッセージが表示されること', async () => {
      await wrapper.find('#body').setValue('')
      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.find('p').text()).toBe('入力に不備があります。')
    })
  })
})
