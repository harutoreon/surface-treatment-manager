import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import SamplesShowView from '@/components/samples/SamplesShowView.vue'
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

describe('SamplesShowView', () => {
  describe('DOMの構造', () => {
    let wrapper

    beforeEach(() => {
      axios.get.mockReturnValue({
        data: {
          "id": 1,
          "name": "無電解ニッケルめっき",
          "category": "めっき",
          "color": "イエローブラウンシルバー",
          "maker": "小島印刷合同会社",
          "created_at": "2025-02-23T22:15:29.815Z",
          "updated_at": "2025-02-23T22:15:29.815Z",
          "picture": "#<File:0x0000ffff859a8be0>",
          "hardness": "析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度",
          "film_thickness": "通常は3～5μm、厚めの場合は20～50μmまで可能",
          "feature": "耐食性・耐摩耗性・耐薬品性・耐熱性",
          "image_url": "http://localhost:3000/rails/active_storage/blobs/sample_image_url.jpeg"
        }
      })

      wrapper = mount(SamplesShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('表面処理情報')
    })

    it('表面処理情報のラベルが表示されること', () => {
      expect(wrapper.find('#label_sample_name').text()).toBe('処理名：')
      expect(wrapper.find('#label_sample_category').text()).toBe('カテゴリー：')
      expect(wrapper.find('#label_sample_color').text()).toBe('色調：')
      expect(wrapper.find('#label_sample_maker').text()).toBe('メーカー：')
      expect(wrapper.find('#label_sample_hardness').text()).toBe('硬度：')
      expect(wrapper.find('#label_sample_film_thickness').text()).toBe('膜厚：')
      expect(wrapper.find('#label_sample_feature').text()).toBe('特徴：')
      expect(wrapper.find('#label_sample_picture').text()).toBe('画像：')
    })

    it('表面処理情報が存在すること', () => {
      expect(wrapper.find('#sample_name').exists()).toBe(true)
      expect(wrapper.find('#sample_category').exists()).toBe(true)
      expect(wrapper.find('#sample_color').exists()).toBe(true)
      expect(wrapper.find('#sample_maker').exists()).toBe(true)
      expect(wrapper.find('#sample_hardness').exists()).toBe(true)
      expect(wrapper.find('#sample_film_thickness').exists()).toBe(true)
      expect(wrapper.find('#sample_feature').exists()).toBe(true)
      expect(wrapper.find('#sample_picture').exists()).toBe(true)
    })

    it('コメントのラベルが表示されること', () => {
      expect(wrapper.find('#label_commenter').text()).toBe('部署名 / 投稿者 / コメント')
      expect(wrapper.find('#label_create_at').text()).toBe('投稿日')
    })

    it('外部リンクが表示されること', () => {
      expect(wrapper.find('#link_sample_edit').text()).toBe('表面処理情報の編集')
      expect(wrapper.find('#link_sample_destroy').text()).toBe('表面処理情報の削除')
      expect(wrapper.find('#link_samples').text()).toBe('表面処理リストへ')
    })
  })

  describe('API通信', () => {
    describe('表面処理情報の取得に成功した場合', () => {
      it('すべての情報が表示されること', async () => {
        axios.get.mockResolvedValue({
          data: {
            "id": 1,
            "name": "無電解ニッケルめっき",
            "category": "めっき",
            "color": "イエローブラウンシルバー",
            "maker": "小島印刷合同会社",
            "hardness": "析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度",
            "film_thickness": "通常は3～5μm、厚めの場合は20～50μmまで可能",
            "feature": "耐食性・耐摩耗性・耐薬品性・耐熱性",
            "image_url": "http://localhost:3000/rails/active_storage/blobs/sample_image_url.jpeg"
          }
        })

        const wrapper = mount(SamplesShowView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.find('#sample_name').text()).toBe('無電解ニッケルめっき')
        expect(wrapper.find('#sample_category').text()).toBe('めっき')
        expect(wrapper.find('#sample_color').text()).toBe('イエローブラウンシルバー')
        expect(wrapper.find('#sample_maker').text()).toBe('小島印刷合同会社')
        expect(wrapper.find('#sample_picture').exists()).toBe(true)
        expect(wrapper.find('#sample_hardness').text()).toBe('析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度')
        expect(wrapper.find('#sample_film_thickness').text()).toBe('通常は3～5μm、厚めの場合は20～50μmまで可能')
        expect(wrapper.find('#sample_feature').text()).toBe('耐食性・耐摩耗性・耐薬品性・耐熱性')
      })
    })

    describe('表面処理情報の取得に失敗した場合', () => {
      it('404ページに遷移すること', async () => {
        axios.get.mockRejectedValue({
          response: {
            status: 404
          },
        })

        const wrapper = mount(SamplesShowView, {
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
      it('すべてのコメントが表示されること', async () => {
        const mockSampleResponse = {
          data: {
            "id": 1,
            "name": "無電解ニッケルめっき",
            "category": "めっき",
            "color": "イエローブラウンシルバー",
            "maker": "小島印刷合同会社",
            "hardness": "析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度",
            "film_thickness": "通常は3～5μm、厚めの場合は20～50μmまで可能",
            "feature": "耐食性・耐摩耗性・耐薬品性・耐熱性",
            "image_url": "http://localhost:3000/rails/active_storage/blobs/sample_image_url.jpeg"
          }
        }

        const mockSampleCommentResponse = {
          data: [
            {
              "id": 1,
              "commenter": "岡本 陽子",
              "body": "表面の質感が滑らかで、触感が良好です。",
              "sample_id": 1,
              "created_at": "2025-02-23T22:15:30.030Z",
              "updated_at": "2025-02-23T22:15:30.030Z",
              "department": "営業部"
            }
          ]
        }

        axios.get
          .mockResolvedValueOnce(mockSampleResponse)
          .mockResolvedValueOnce(mockSampleCommentResponse)

        const wrapper = mount(SamplesShowView, {
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
          .mockRejectedValueOnce(mockSampleResponse)
          .mockRejectedValueOnce(mockSampleCommentResponse)

        const wrapper = mount(SamplesShowView, {
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

    describe('表面処理の削除選択でOKを押した場合', () => {
      it('削除成功のメッセージが表示され表面処理リストのページに遷移する', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)
        
        axios.get
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
              image_url: 'http://example.com/sample.jpg',
            }
          })
          .mockResolvedValueOnce({ 
            data: []
          })

        const wrapper = mount(SamplesShowView, {
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
    
    describe('表面処理の削除選択でキャンセルを押した場合', () => {
      it('削除処理は実行されずページ遷移も行われないこと', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(false)
        axios.delete = vi.fn()
  
        const wrapper = mount(SamplesShowView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })
  
        await flushPromises()
  
        await wrapper.find('#link_sample_destroy').trigger('click')
  
        expect(axios.delete).not.toHaveBeenCalled()
        expect(wrapper.find('h3').text()).toBe('表面処理情報')
      })
    })

    describe('表面処理の削除処理に失敗した場合', () => {
      it('404ページに遷移すること', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)

        axios.get
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
              image_url: 'http://example.com/sample.jpg',
            }
          })
          .mockResolvedValueOnce({ 
            data: []
          })

        axios.delete = vi.fn().mockRejectedValue({
          response: {
            status: 404
          }
        })

        const wrapper = mount(SamplesShowView, {
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
})
