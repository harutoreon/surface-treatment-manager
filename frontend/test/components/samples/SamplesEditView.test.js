import SamplesEditView from '@/components/samples/SamplesEditView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const pushMock = vi.fn()
const replaceMock = vi.fn()

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
        push: pushMock,
        replace: replaceMock
      }
    }
  }
})

describe('SamplesEditView', () => {
  let wrapper

  describe('ログインチェックに成功した場合', () => {
    it('表面処理情報の編集ページに移動すること', async () => {
      axios.get
        .mockResolvedValueOnce({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockResolvedValueOnce({  // fetchSampleData()
          data: {
            id: 1,
            name: '無電解ニッケルめっき',
            category: 'めっき',
            color: 'コールド',
            maker: 'サンプルメーカー',
            hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
            film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
            feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
            summary: '電気を使わず化学反応で金属表面にニッケルを析出する技術です。',
            image_url: 'http://localhost:3000/rails/active_storage/blobs/redirect//test.jpg'
          }
        })

      wrapper = mount(SamplesEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('表面処理情報の編集')
    })
  })

  describe('ログインチェックに失敗した場合', () => {
    it('ログインページに移動すること', async () => {
      axios.get.mockRejectedValue({  // checkLoginStatus()
        response: {
          status: 401
        }
      })

      wrapper = mount(SamplesEditView, {
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
    })
  })

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            name: '無電解ニッケルめっき',
            category: 'めっき',
            color: 'コールド',
            maker: 'サンプルメーカー',
            hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
            film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
            feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
            summary: '電気を使わず化学反応で金属表面にニッケルを析出する技術です。',
            image_url: 'http://localhost:3000/rails/active_storage/blobs/redirect//test.jpg'
          }
        })

      wrapper = mount(SamplesEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('表面処理情報の編集')
    })

    it('入力フォームが表示されること', () => {
      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      expect(wrapper.find('label[for="sample-name"]').text()).toContain('処理名')
      expect(wrapper.find('label[for="sample-category"]').text()).toContain('カテゴリー')
      expect(wrapper.find('label[for="sample-color"]').text()).toContain('色調')
      expect(wrapper.find('label[for="sample-maker"]').text()).toContain('メーカー')
      expect(wrapper.find('label[for="sample-hardness"]').text()).toContain('硬度')
      expect(wrapper.find('label[for="sample-film-thickness"]').text()).toContain('膜厚')
      expect(wrapper.find('label[for="sample-feature"]').text()).toContain('特徴')
      expect(wrapper.find('label[for="sample-summary"]').text()).toContain('概要')
      expect(wrapper.find('label[for="sample-image"]').text()).toContain('画像')

      // 入力要素
      expect(wrapper.find('#sample-name').exists()).toBe(true)
      expect(wrapper.find('#sample-category').exists()).toBe(true)
      expect(wrapper.find('#sample-color').exists()).toBe(true)
      expect(wrapper.find('#sample-maker').exists()).toBe(true)
      expect(wrapper.find('#sample-hardness').exists()).toBe(true)
      expect(wrapper.find('#sample-film-thickness').exists()).toBe(true)
      expect(wrapper.find('#sample-feature').exists()).toBe(true)
      expect(wrapper.find('#sample-summary').exists()).toBe(true)

      // 入力要素の値
      expect(wrapper.find('#sample-name').element.value).toBe('無電解ニッケルめっき')
      expect(wrapper.find('#sample-category').element.value).toBe('めっき')
      expect(wrapper.find('#sample-color').element.value).toBe('コールド')
      expect(wrapper.find('#sample-maker').element.value).toBe('サンプルメーカー')
      expect(wrapper.find('#sample-hardness').element.value).toBe('析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度')
      expect(wrapper.find('#sample-film-thickness').element.value).toBe('通常は3～5μm、厚めの場合は20～50μmまで可能')
      expect(wrapper.find('#sample-feature').element.value).toBe('耐食性・耐摩耗性・耐薬品性・耐熱性')
      expect(wrapper.find('#sample-summary').element.value).toBe('電気を使わず化学反応で金属表面にニッケルを析出する技術です。')

      // 画像埋め込み要素
      expect(wrapper.find('#sample-image').attributes('src')).toContain('test.jpg')

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('更新')
    })

    it('外部リンクが表示されること', () => {
      const routerLinks = wrapper.findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLinks[0].props().to).toBe('/samples/1')
      expect(routerLinks[1].props().to).toBe('/samples')

      // テキスト
      expect(routerLinks[0].text()).toBe('表面処理情報へ')
      expect(routerLinks[1].text()).toBe('表面処理リストへ')
    })    
  })

  describe('初期レンダリングに失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      axios.get
        .mockResolvedValue({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockRejectedValue({
          response: {
            status: 404
          }
        })

      wrapper = mount(SamplesEditView, {
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

  describe('有効な情報を送信した場合', () => {
    it('更新に成功すること', async () => {
      const mockResponse = {
        data: {
          id: 35,
          name: '無電解ニッケルめっき',
          category: 'めっき',
          color: 'ゴールド',
          maker: 'サンプルメーカー',
          created_at: '2025-04-29 16:56:41.915846000 +0000',
          updated_at: '2025-04-29 16:56:41.931970000 +0000',
          hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
          film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
          feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
          summary: '電気を使わず化学反応で金属表面にニッケルを析出する技術です。',
          image_url: 'http://localhost:3000/rails/active_storage/blobs/redirect/test.jpg'
        }
      }

      axios.get
        .mockResolvedValueOnce({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockResolvedValue(mockResponse)

      axios.patch.mockResolvedValue(mockResponse)

      wrapper = mount(SamplesEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('#sample-name').element.value).toBe('無電解ニッケルめっき')
      expect(wrapper.find('#sample-category').element.value).toBe('めっき')
      expect(wrapper.find('#sample-color').element.value).toBe('ゴールド')
      expect(wrapper.find('#sample-maker').element.value).toBe('サンプルメーカー')
      expect(wrapper.find('#sample-hardness').element.value).toBe('析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度')
      expect(wrapper.find('#sample-film-thickness').element.value).toBe('通常は3～5μm、厚めの場合は20～50μmまで可能')
      expect(wrapper.find('#sample-feature').element.value).toBe('耐食性・耐摩耗性・耐薬品性・耐熱性')
      expect(wrapper.find('#sample-summary').element.value).toBe('電気を使わず化学反応で金属表面にニッケルを析出する技術です。')
      expect(wrapper.find('#sample-image').attributes('src')).toContain('test.jpg')

      await wrapper.find('form').trigger('submit.prevent')

      expect(axios.patch).toHaveBeenCalled()
      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'success', text: '表面処理情報を更新しました。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/samples/35')
    })
  })
  
  describe('無効な情報を送信した場合', () => {
    it('更新に失敗すること', async () => {
      axios.get
        .mockResolvedValueOnce({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockResolvedValueOnce({
          data: {
            id: 35,
            name: '無電解ニッケルめっき',
            category: 'めっき',
            color: 'ゴールド',
            maker: 'サンプルメーカー',
            created_at: '2025-04-29 16:56:41.915846000 +0000',
            updated_at: '2025-04-29 16:56:41.931970000 +0000',
            hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
            film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
            feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
            summary: '電気を使わず化学反応で金属表面にニッケルを析出する技術です。',
            image_url: 'http://localhost:3000/rails/active_storage/blobs/redirect/test.jpg'
          }
        })

      axios.patch.mockRejectedValue({
        response: {
          status: 422
        }
      })

      wrapper = mount(SamplesEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('#sample-name').element.value).toBe('無電解ニッケルめっき')
      expect(wrapper.find('#sample-category').element.value).toBe('めっき')
      expect(wrapper.find('#sample-color').element.value).toBe('ゴールド')
      expect(wrapper.find('#sample-maker').element.value).toBe('サンプルメーカー')
      expect(wrapper.find('#sample-hardness').element.value).toBe('析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度')
      expect(wrapper.find('#sample-film-thickness').element.value).toBe('通常は3～5μm、厚めの場合は20～50μmまで可能')
      expect(wrapper.find('#sample-feature').element.value).toBe('耐食性・耐摩耗性・耐薬品性・耐熱性')
      expect(wrapper.find('#sample-summary').element.value).toBe('電気を使わず化学反応で金属表面にニッケルを析出する技術です。')
      expect(wrapper.find('#sample-image').attributes('src')).toContain('test.jpg')

      wrapper.find('#sample-name').setValue('')
      
      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.text()).toContain('入力に不備があります。')
    })
  })
})