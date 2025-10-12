import CommentsNewView from '@/components/comments/CommentsNewView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub,  } from '@vue/test-utils'
import axios from 'axios'

const replaceMock = vi.fn()
const pushMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        replace: replaceMock,
        push: pushMock
      }
    }
  }
})

describe('CommentsNewView', () => {
  let wrapper

  describe('ログインチェックに成功した場合', () => {
    it('コメント情報の新規登録ページに移動すること', async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          status: 200
        })

      wrapper = mount(CommentsNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('コメント情報の新規登録')
    })
  })

  describe('ログインチェックに失敗した場合', () => {
    it('ログインページに移動すること', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 401
        }
      })

      wrapper = mount(CommentsNewView, {
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
      expect(pushMock).not.toHaveBeenCalledWith('/departments')
      expect(pushMock).not.toHaveBeenCalledWith('/sample_list')
    })
  })

  describe('初期レンダリング', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '品質管理部' },
            { id: 2, name: '製造部' },
            { id: 3, name: '開発部' },
            { id: 4, name: '営業部' },
          ]
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '硬質クロムめっき' },
            { id: 2, name: '無電解ニッケルめっき' },
            { id: 3, name: '金めっき' },
            { id: 4, name: '窒化処理' },
          ]
        })

      wrapper = mount(CommentsNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })
        
      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('コメント情報の新規登録')
    })

    it('入力フォームが表示されること', () => {
      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      expect(wrapper.find('label[for="commenter"]').text()).toBe('投稿者')
      expect(wrapper.find('label[for="departments"]').text()).toBe('部署名')
      expect(wrapper.find('label[for="samples"]').text()).toBe('表面処理')
      expect(wrapper.find('label[for="body"]').text()).toBe('コメント')

      // 入力要素
      expect(wrapper.find('#commenter').exists()).toBe(true)

      // 部署名の選択要素
      const departmentSelect = wrapper.find('#departments')
      const departmentSelectOptions = departmentSelect.findAll('option')

      expect(departmentSelect.exists()).toBe(true)
      expect(departmentSelectOptions[0].text()).toBe('部署名を選択して下さい')
      expect(departmentSelectOptions[1].text()).toBe('品質管理部')
      expect(departmentSelectOptions[2].text()).toBe('製造部')
      expect(departmentSelectOptions[3].text()).toBe('開発部')
      expect(departmentSelectOptions[4].text()).toBe('営業部')

      // 表面処理の選択要素
      const sampleSelect = wrapper.find('#samples')
      const sampleSelectOptions = sampleSelect.findAll('option')

      expect(sampleSelect.exists()).toBe(true)
      expect(sampleSelectOptions[0].text()).toBe('表面処理を選択して下さい')
      expect(sampleSelectOptions[1].text()).toBe('硬質クロムめっき')
      expect(sampleSelectOptions[2].text()).toBe('無電解ニッケルめっき')
      expect(sampleSelectOptions[3].text()).toBe('金めっき')
      expect(sampleSelectOptions[4].text()).toBe('窒化処理')

      // テキストエリア要素
      expect(wrapper.find('#body').exists()).toBe(true)

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('登録')
    })

    it('外部リンクが表示されること', () => {
      const routerLink = wrapper.findComponent(RouterLinkStub)

      expect(routerLink.props().to).toBe('/comments')
      expect(routerLink.text()).toBe('コメントリストへ')
    })
  })

  describe('部署リストの取得に失敗した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockRejectedValueOnce({
          response: {
            status: 404
          }
        })

      wrapper = mount(CommentsNewView, {
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
        { type: 'danger', text: '部署リストの取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('表面処理リストの取得に失敗した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          status: 200
        })
        .mockRejectedValueOnce({
          response: {
            status: 404
          }
        })

      wrapper = mount(CommentsNewView, {
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
        { type: 'danger', text: '表面処理リストの取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('コメント情報の新規登録に成功した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '品質管理部' },
            { id: 2, name: '製造部' },
            { id: 3, name: '開発部' },
            { id: 4, name: '営業部' },
          ]
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '硬質クロムめっき' },
            { id: 2, name: '無電解ニッケルめっき' },
            { id: 3, name: '金めっき' },
            { id: 4, name: '窒化処理' },
          ]
        })

      axios.post.mockResolvedValue({
        data: {
          id: 1,
          commenter: '工藤 琴音',
          department: '品質管理部',
          body: '製品に高級感を与える仕上がりで、見た目も美しいです。',
        }
      })

      wrapper = mount(CommentsNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('コメントリストページに遷移すること', async () => {
      await wrapper.find('#commenter').setValue('工藤 琴音')
      await wrapper.find('#departments').setValue('品質管理部')
      await wrapper.find('#samples').setValue('硬質クロムめっき')
      await wrapper.find('#body').setValue('製品に高級感を与える仕上がりで、見た目も美しいです。')

      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'success', text: 'コメント情報を1件登録しました。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/comments/1')
    })
  })

  describe('コメント情報の新規登録に失敗した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '品質管理部' },
            { id: 2, name: '製造部' },
            { id: 3, name: '開発部' },
            { id: 4, name: '営業部' },
          ]
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '硬質クロムめっき' },
            { id: 2, name: '無電解ニッケルめっき' },
            { id: 3, name: '金めっき' },
            { id: 4, name: '窒化処理' },
          ]
        })

      axios.post.mockRejectedValue({
        response: {
          status: 422
        }
      })

      wrapper = mount(CommentsNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('入力不備のメッセージが表示されること', async () => {
      await wrapper.find('#commenter').setValue('')
      await wrapper.find('#departments').setValue('品質管理部')
      await wrapper.find('#samples').setValue('硬質クロムめっき')
      await wrapper.find('#body').setValue('製品に高級感を与える仕上がりで、見た目も美しいです。')

      await wrapper.find('form').trigger('submit.prevent')
    
      expect(wrapper.find('p').text()).toContain('入力に不備があります。')
    })
  })
})
