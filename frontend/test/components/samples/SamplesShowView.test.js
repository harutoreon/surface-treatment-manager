import SamplesShowView from '@/components/samples/SamplesShowView.vue'
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

describe('SamplesShowView', () => {
  let wrapper

  describe('ログインチェックに成功した場合', () => {
    it('表面処理情報ページに移動すること', async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            name: '無電解ニッケルめっき',
            category: 'めっき',
            color: 'イエローブラウンシルバー',
            maker: '小島印刷合同会社',
            created_at: '2025-02-23T22:15:29.815Z',
            updated_at: '2025-02-23T22:15:29.815Z',
            hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
            film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
            feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
            summary: '電気を使わず化学反応で金属表面にニッケルを析出する技術です。',
            image_url: 'http://localhost:3000/rails/active_storage/blobs/sample_image_url.jpeg',
          }
        })
        .mockResolvedValueOnce({
          data: [
            {
              id: 1,
              commenter: '岡本 陽子',
              body: '表面の質感が滑らかで、触感が良好です。',
              sample_id: 1,
              created_at: '2025-02-23T22:15:30.030Z',
              department: '営業部',
            }
          ]
        })

      wrapper = mount(SamplesShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('表面処理情報')
    })
  })

  describe('ログインチェックに失敗した場合', () => {
    it('ログインページに移動すること', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 401
        }
      })

      wrapper = mount(SamplesShowView, {
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
      expect(pushMock).not.toHaveBeenCalledWith(`/samples/${id}`)
      expect(pushMock).not.toHaveBeenCalledWith(`/samples/${id}/comments`)
    })
  })

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockReturnValueOnce({
          data: {
            id: 1,
            name: '無電解ニッケルめっき',
            category: 'めっき',
            color: 'イエローブラウンシルバー',
            maker: '小島印刷合同会社',
            created_at: '2025-02-23T22:15:29.815Z',
            updated_at: '2025-02-23T22:15:29.815Z',
            hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
            film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
            feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
            summary: '電気を使わず化学反応で金属表面にニッケルを析出する技術です。',
            image_url: 'http://localhost:3000/rails/active_storage/blobs/sample_image_url.jpeg',
          }
        })

      wrapper = mount(SamplesShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('表面処理情報')
    })

    it('表面処理情報が表示されること', () => {
      // 処理名
      expect(wrapper.text()).toContain('無電解ニッケルめっき')

      // カテゴリー
      expect(wrapper.text()).toContain('めっき')

      // 色調
      expect(wrapper.text()).toContain('イエローブラウンシルバー')

      // メーカー
      expect(wrapper.text()).toContain('小島印刷合同会社')

      // 硬度
      expect(wrapper.text()).toContain('HV550～HV700')

      // 膜厚
      expect(wrapper.text()).toContain('3～5μm')

      // 特徴
      expect(wrapper.text()).toContain('耐食性')

      // 概要
      expect(wrapper.text()).toContain('電気を使わず化学反応で金属表面にニッケルを析出する技術です。')

      // 画像
      expect(wrapper.find('img').attributes('src')).toContain('sample_image_url.jpeg')
    })

    it('外部リンクが表示されること', () => {
      const routerLinks = wrapper.findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLinks[0].props().to).toBe('/samples/1/edit')
      expect(routerLinks[1].props().to).toBe('/samples')

      // テキスト
      expect(routerLinks[0].text()).toBe('表面処理情報の編集')
      expect(routerLinks[1].text()).toBe('表面処理リストへ')
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

      wrapper = mount(SamplesShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: '表面処理情報の取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('コメントの取得に成功した場合', () => {
    it('コメントが表示されること', async () => {
      const mockSampleResponse = {
        data: {
          id: 1,
          name: '無電解ニッケルめっき',
          category: 'めっき',
          color: 'イエローブラウンシルバー',
          maker: '小島印刷合同会社',
          hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
          film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
          feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
          summary: '電気を使わず化学反応で金属表面にニッケルを析出する技術です。',
          image_url: 'http://localhost:3000/rails/active_storage/blobs/sample_image_url.jpeg',
        }
      }

      const mockSampleCommentResponse = {
        data: [
          {
            id: 1,
            commenter: '岡本 陽子',
            body: '表面の質感が滑らかで、触感が良好です。',
            sample_id: 1,
            created_at: '2025-02-23T22:15:30.030Z',
            department: '営業部',
          }
        ]
      }

      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce(mockSampleResponse)
        .mockResolvedValueOnce(mockSampleCommentResponse)

      wrapper = mount(SamplesShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.html()).toContain('営業部：岡本 陽子')
      expect(wrapper.html()).toMatch(/\d{4}\/\d{1,2}\/\d{1,2}/)
      expect(wrapper.html()).toContain('表面の質感が滑らかで、触感が良好です。')
    })
  })

  describe('コメントの取得に失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      const mockSampleResponse = {
        response: {
          status: 404
        }
      }

      const mockSampleCommentResponse = {
        response: {
          status: 404
        }
      }
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockRejectedValueOnce(mockSampleResponse)
        .mockRejectedValueOnce(mockSampleCommentResponse)

      wrapper = mount(SamplesShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })
      
      await flushPromises()

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[1]).toEqual([
        { type: 'danger', text: 'コメントの取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('表面処理の削除処理に成功した場合', () => {
    it('表面処理リストページに遷移する', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true)
      
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            name: '無電解ニッケルめっき',
            category: 'めっき',
            color: 'イエローブラウンシルバー',
            maker: '小島印刷合同会社',
            hardness: 'HV700',
            film_thickness: '5μm',
            feature: '耐摩耗性',
            summary: '電気を使わず化学反応で金属表面にニッケルを析出する技術です。',
            image_url: 'http://example.com/sample.jpg',
          }
        })
        .mockResolvedValueOnce({ 
          data: [
            {
              id: 1,
              commenter: '岡本 陽子',
              body: '表面の質感が滑らかで、触感が良好です。',
              sample_id: 1,
              created_at: '2025-02-23T22:15:30.030Z',
              department: '営業部',
            }
          ]
        })

      wrapper = mount(SamplesShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      await wrapper.find('#link_sample_destroy').trigger('click')

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'success', text: '表面処理情報を削除しました。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/samples')
    })
  })
  
  describe('表面処理の削除処理に失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true)

      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            name: '無電解ニッケルめっき',
            category: 'めっき',
            color: 'イエローブラウンシルバー',
            maker: '小島印刷合同会社',
            hardness: 'HV700',
            film_thickness: '5μm',
            feature: '耐摩耗性',
            summary: '電気を使わず化学反応で金属表面にニッケルを析出する技術です。',
            image_url: 'http://example.com/sample.jpg',
          }
        })
        .mockResolvedValueOnce({ 
          data: [
            {
              id: 1,
              commenter: '岡本 陽子',
              body: '表面の質感が滑らかで、触感が良好です。',
              sample_id: 1,
              created_at: '2025-02-23T22:15:30.030Z',
              department: '営業部',
            }
          ]
        })

      axios.delete = vi.fn().mockRejectedValue({
        response: {
          status: 404
        }
      })

      wrapper = mount(SamplesShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      await wrapper.find('#link_sample_destroy').trigger('click')

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: '表面処理情報の削除処理に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })
})
