import { describe, it, expect,vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import SamplesEditView from '@/components/samples/SamplesEditView.vue'
import axios from 'axios'

vi.mock('axios')

const pushMock = vi.fn()
const replaceMock = vi.fn()

vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        params: { id: '1' }
      }
    },
    useRouter: () => {
      return {
        push: pushMock,
        replace: replaceMock
      }
    }
  }
})

describe('SamplesEditView', () => {
  describe('DOMの構造', () => {
    axios.get.mockResolvedValue({
      data: {
        id: 35,
        name: "無電解ニッケルめっき",
        category: "めっき",
        color: "コールド",
        maker: "サンプルメーカー",
        created_at: "2025-04-29 16:56:41.915846000 +0000",
        updated_at: "2025-04-29 16:56:41.931970000 +0000",
        hardness: "析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度",
        film_thickness: "通常は3～5μm、厚めの場合は20～50μmまで可能",
        feature: "耐食性・耐摩耗性・耐薬品性・耐熱性",
        image_url: "http://localhost:3000/rails/active_storage/blobs/redirect//test.jpg"
      }
    })

    let wrapper

    beforeEach(() => {
      wrapper = mount(SamplesEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })
    })

    it('見出しが存在すること', () => {
      expect(wrapper.find('h3').exists()).toBe(true)
      expect(wrapper.find('h3').text()).toBe('表面処理情報の編集')
    })

    it('すべてのラベルが存在すること', () => {
      expect(wrapper.find('#label_sample_name').exists()).toBe(true)
      expect(wrapper.find('#label_sample_name').text()).toBe('処理名')

      expect(wrapper.find('#label_sample_category').exists()).toBe(true)
      expect(wrapper.find('#label_sample_category').text()).toBe('カテゴリー')

      expect(wrapper.find('#label_sample_color').exists()).toBe(true)
      expect(wrapper.find('#label_sample_color').text()).toBe('色調')

      expect(wrapper.find('#label_sample_maker').exists()).toBe(true)
      expect(wrapper.find('#label_sample_maker').text()).toBe('メーカー')

      expect(wrapper.find('#label_sample_hardness').exists()).toBe(true)
      expect(wrapper.find('#label_sample_hardness').text()).toBe('硬度')

      expect(wrapper.find('#label_sample_film_thickness').exists()).toBe(true)
      expect(wrapper.find('#label_sample_film_thickness').text()).toBe('膜厚')

      expect(wrapper.find('#label_sample_feature').exists()).toBe(true)
      expect(wrapper.find('#label_sample_feature').text()).toBe('特徴')

      expect(wrapper.find('#label_sample_picture').exists()).toBe(true)
      expect(wrapper.find('#label_sample_picture').text()).toBe('画像')
    })

    it('すべてのテキスト入力が存在すること', () => {
      expect(wrapper.find('#sample_name').exists()).toBe(true)
      expect(wrapper.find('#sample_category').exists()).toBe(true)
      expect(wrapper.find('#sample_color').exists()).toBe(true)
      expect(wrapper.find('#sample_maker').exists()).toBe(true)
      expect(wrapper.find('#sample_hardness').exists()).toBe(true)
      expect(wrapper.find('#sample_film_thickness').exists()).toBe(true)
      expect(wrapper.find('#sample_feature').exists()).toBe(true)
    })

    it('画像プレビューが存在すること', () => {
      expect(wrapper.find('#preview_image').exists()).toBe(true)
    })

    it('ボタンが存在すること', () => {
      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.find('button').text()).toBe('更新')
    })

    it('外部リンクが存在すること', () => {
      expect(wrapper.find('#sample_show').exists()).toBe(true)
      expect(wrapper.find('#sample_show').text()).toBe('表面処理情報へ')
      expect(wrapper.findComponent('#sample_show').props().to).toBe('/samples/35')
      
      expect(wrapper.find('#sample_list').exists()).toBe(true)
      expect(wrapper.find('#sample_list').text()).toBe('表面処理リストへ')
      expect(wrapper.findComponent('#sample_list').props().to).toBe('/samples')
    })    
  })

  describe('API通信', () => {
    describe('表面処理情報の取得に成功した場合', () => {
      it('フォームフィールドに表面処理情報が表示されること', async () => {
        axios.get.mockResolvedValue({
          data: {
            id: 35,
            name: "無電解ニッケルめっき",
            category: "めっき",
            color: "ゴールド",
            maker: "サンプルメーカー",
            created_at: "2025-04-29 16:56:41.915846000 +0000",
            updated_at: "2025-04-29 16:56:41.931970000 +0000",
            hardness: "析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度",
            film_thickness: "通常は3～5μm、厚めの場合は20～50μmまで可能",
            feature: "耐食性・耐摩耗性・耐薬品性・耐熱性",
            image_url: "http://localhost:3000/rails/active_storage/blobs/redirect/test.jpg"
          }
        })

        const wrapper = mount(SamplesEditView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.find('#sample_name').element.value).toBe('無電解ニッケルめっき')
        expect(wrapper.find('#sample_category').element.value).toBe('めっき')
        expect(wrapper.find('#sample_color').element.value).toBe('ゴールド')
        expect(wrapper.find('#sample_maker').element.value).toBe('サンプルメーカー')
        expect(wrapper.find('#sample_hardness').element.value).toBe('析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度')
        expect(wrapper.find('#sample_film_thickness').element.value).toBe('通常は3～5μm、厚めの場合は20～50μmまで可能')
        expect(wrapper.find('#sample_feature').element.value).toBe('耐食性・耐摩耗性・耐薬品性・耐熱性')
        expect(wrapper.find('#preview_image').attributes('src')).toBe('http://localhost:3000/rails/active_storage/blobs/redirect/test.jpg')
      })
    })

    describe('表面処理情報の取得に失敗した場合', () => {
      it('404ページに遷移すること', async () => {
        axios.get.mockRejectedValue({
          response: {
            status: 404
          }
        })

        const wrapper = mount(SamplesEditView, {
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

    describe('有効な情報を入力して送信した場合', () => {
      it('更新が成功すること', async () => {
        const mockResponse = {
          data: {
            id: 35,
            name: "無電解ニッケルめっき",
            category: "めっき",
            color: "ゴールド",
            maker: "サンプルメーカー",
            created_at: "2025-04-29 16:56:41.915846000 +0000",
            updated_at: "2025-04-29 16:56:41.931970000 +0000",
            hardness: "析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度",
            film_thickness: "通常は3～5μm、厚めの場合は20～50μmまで可能",
            feature: "耐食性・耐摩耗性・耐薬品性・耐熱性",
            image_url: "http://localhost:3000/rails/active_storage/blobs/redirect/test.jpg"
          }
        }

        axios.get.mockResolvedValue(mockResponse)
        axios.patch.mockResolvedValue(mockResponse)

        const wrapper = mount(SamplesEditView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.find('#sample_name').element.value).toBe('無電解ニッケルめっき')
        expect(wrapper.find('#sample_category').element.value).toBe('めっき')
        expect(wrapper.find('#sample_color').element.value).toBe('ゴールド')
        expect(wrapper.find('#sample_maker').element.value).toBe('サンプルメーカー')
        expect(wrapper.find('#sample_hardness').element.value).toBe('析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度')
        expect(wrapper.find('#sample_film_thickness').element.value).toBe('通常は3～5μm、厚めの場合は20～50μmまで可能')
        expect(wrapper.find('#sample_feature').element.value).toBe('耐食性・耐摩耗性・耐薬品性・耐熱性')
        expect(wrapper.find('#preview_image').attributes('src')).toBe('http://localhost:3000/rails/active_storage/blobs/redirect/test.jpg')

        await wrapper.find('form').trigger('submit.prevent')

        expect(axios.patch).toHaveBeenCalled()
        expect(wrapper.emitted()).toHaveProperty('message')
        expect(wrapper.emitted().message[0]).toEqual([
          { type: 'success', text: '表面処理情報を更新しました。' }
        ])
        expect(pushMock).toHaveBeenCalledWith('/samples/35')
      })
    })
    
    describe('空の状態で送信した場合', () => {
      it('更新に失敗すること', async () => {
        axios.patch.mockRejectedValue(new Error('Validation error'))

        const wrapper = mount(SamplesEditView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })
  
        await flushPromises()
        await wrapper.find('form').trigger('submit.prevent')
  
        expect(wrapper.text()).toContain('入力に不備があります。')
      })
    })
  })
})