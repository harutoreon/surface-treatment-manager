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
        .mockResolvedValueOnce({  // ログインチェック
          status: 200
        })
        .mockResolvedValueOnce({  // メーカーリストの取得
          status: 200
        })
        .mockResolvedValueOnce({  // ユーザーリストの取得
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
        .mockResolvedValueOnce({  // ログインチェック
          status: 200
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '東亜電化工業株式会社' },
            { id: 2, name: '新星コーティングス' },
            { id: 3, name: '大和表面技術研究所' },
            { id: 4, name: '中央メッキ技研' },
            { id: 5, name: 'サンエース・フィニッシュ' },
            { id: 6, name: '瑞穂皮膜加工' },
            { id: 7, name: 'アストロ産業' },
            { id: 8, name: '明和サーフェス' },
            { id: 9, name: '富士理化研磨株式会社' },
            { id: 10, name: '高周波サーマル工業' },
          ]
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '岩崎 颯太', department: '品質管理部' },
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
      expect(wrapper.find('label[for="makers"]').text()).toBe('メーカー')
      expect(wrapper.find('label[for="body"]').text()).toBe('コメント')

      // 入力要素
      expect(wrapper.find('#commenter').exists()).toBe(true)
      expect(wrapper.find('#department').exists()).toBe(true)


      // メーカーの選択要素
      const makerSelect = wrapper.find('#makers')
      const makerSelectOptions = makerSelect.findAll('option')

      expect(makerSelect.exists()).toBe(true)
      expect(makerSelectOptions[0].text()).toBe('メーカーを選択して下さい')
      expect(makerSelectOptions[1].text()).toBe('東亜電化工業株式会社')
      expect(makerSelectOptions[2].text()).toBe('新星コーティングス')
      expect(makerSelectOptions[3].text()).toBe('大和表面技術研究所')
      expect(makerSelectOptions[4].text()).toBe('中央メッキ技研')
      expect(makerSelectOptions[5].text()).toBe('サンエース・フィニッシュ')
      expect(makerSelectOptions[6].text()).toBe('瑞穂皮膜加工')
      expect(makerSelectOptions[7].text()).toBe('アストロ産業')
      expect(makerSelectOptions[8].text()).toBe('明和サーフェス')
      expect(makerSelectOptions[9].text()).toBe('富士理化研磨株式会社')
      expect(makerSelectOptions[10].text()).toBe('高周波サーマル工業')

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

  describe('表面処理リストの取得に失敗した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({  // ログインチェック
          status: 200
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '東亜電化工業株式会社' },
            { id: 2, name: '新星コーティングス' },
            { id: 3, name: '大和表面技術研究所' },
            { id: 4, name: '中央メッキ技研' },
            { id: 5, name: 'サンエース・フィニッシュ' },
            { id: 6, name: '瑞穂皮膜加工' },
            { id: 7, name: 'アストロ産業' },
            { id: 8, name: '明和サーフェス' },
            { id: 9, name: '富士理化研磨株式会社' },
            { id: 10, name: '高周波サーマル工業' },
          ]
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '岩崎 颯太', department: '品質管理部' },
          ]
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

    it('404ページに遷移すること', async () => {
      await wrapper.find('#makers').setValue('東亜電化工業株式会社')

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: '表面処理リストの取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('メーカーを選択した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({  // ログインチェック
          status: 200
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '東亜電化工業株式会社' },
            { id: 2, name: '新星コーティングス' },
            { id: 3, name: '大和表面技術研究所' },
            { id: 4, name: '中央メッキ技研' },
            { id: 5, name: 'サンエース・フィニッシュ' },
            { id: 6, name: '瑞穂皮膜加工' },
            { id: 7, name: 'アストロ産業' },
            { id: 8, name: '明和サーフェス' },
            { id: 9, name: '富士理化研磨株式会社' },
            { id: 10, name: '高周波サーマル工業' },
          ]
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '岩崎 颯太', department: '品質管理部' },
          ]
        })
        .mockResolvedValueOnce({
          data: {
            samples: [
              { id: 1, name: '無電解ニッケルめっき' },
              { id: 2, name: '白金めっき' },
              { id: 3, name: '金めっき' },
            ]
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

    it('表面処理が選択可能となること', async () => {
      await wrapper.find('#makers').setValue('東亜電化工業株式会社')

      const sampleSelect = wrapper.find('#samples')
      const options = sampleSelect.findAll('option')

      expect(sampleSelect.exists()).toBe(true)
      expect(options[1].text()).toBe('無電解ニッケルめっき')
      expect(options[2].text()).toBe('白金めっき')
      expect(options[3].text()).toBe('金めっき')
    })
  })

  describe('コメント情報の新規登録に成功した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({  // ログインチェック
          status: 200
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '東亜電化工業株式会社' },
            { id: 2, name: '新星コーティングス' },
            { id: 3, name: '大和表面技術研究所' },
            { id: 4, name: '中央メッキ技研' },
            { id: 5, name: 'サンエース・フィニッシュ' },
            { id: 6, name: '瑞穂皮膜加工' },
            { id: 7, name: 'アストロ産業' },
            { id: 8, name: '明和サーフェス' },
            { id: 9, name: '富士理化研磨株式会社' },
            { id: 10, name: '高周波サーマル工業' },
          ]
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '岩崎 颯太', department: '品質管理部' },
          ]
        })

      axios.post.mockResolvedValue({
        data: {
          id: 1,
          commenter: '工藤 琴音',
          department: '品質管理部',
          body: '製品に高級感を与える仕上がりで、見た目も美しいです。',
          user_id: 1
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

    it('コメント情報ページに遷移すること', async () => {
      await wrapper.find('#commenter').setValue('工藤 琴音')
      await wrapper.find('#department').setValue('品質管理部')
      await wrapper.find('#makers').setValue('東亜電化工業株式会社')
      await wrapper.find('#samples').setValue('無電解ニッケルめっき')
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
        .mockResolvedValueOnce({  // ログインチェック
          status: 200
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '東亜電化工業株式会社' },
            { id: 2, name: '新星コーティングス' },
            { id: 3, name: '大和表面技術研究所' },
            { id: 4, name: '中央メッキ技研' },
            { id: 5, name: 'サンエース・フィニッシュ' },
            { id: 6, name: '瑞穂皮膜加工' },
            { id: 7, name: 'アストロ産業' },
            { id: 8, name: '明和サーフェス' },
            { id: 9, name: '富士理化研磨株式会社' },
            { id: 10, name: '高周波サーマル工業' },
          ]
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '岩崎 颯太', department: '品質管理部' },
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
      await wrapper.find('#department').setValue('品質管理部')
      await wrapper.find('#makers').setValue('東亜電化工業株式会社')
      await wrapper.find('#samples').setValue('無電解ニッケルめっき')
      await wrapper.find('#body').setValue('製品に高級感を与える仕上がりで、見た目も美しいです。')

      await wrapper.find('form').trigger('submit.prevent')
    
      expect(wrapper.find('p').text()).toContain('入力に不備があります。')
    })
  })
})
