import SamplesNewView from '@/components/samples/SamplesNewView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const pushMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock
      }
    }
  }
})

describe('SamplesNewView', () => { 
  let wrapper

  describe('初期レンダリング', () => {
    beforeEach(() => {
      axios.get.mockResolvedValue({
        data: [
          { id: 1, item: 'めっき' },
          { id: 2, item: '陽極酸化' },
          { id: 3, item: '化成' },
          { id: 4, item: 'コーティング' },
          { id: 5, item: '表面硬化' },
        ]
      })

      wrapper = mount(SamplesNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('表面処理情報の登録')
    })

    it('入力フォームが表示されること', () => {
      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      expect(wrapper.find('label[for="sample-name"]').text()).toBe('処理名')
      expect(wrapper.find('label[for="sample-category"]').text()).toBe('カテゴリー')
      expect(wrapper.find('label[for="sample-color"]').text()).toBe('色調')
      expect(wrapper.find('label[for="sample-maker"]').text()).toBe('メーカー')
      expect(wrapper.find('label[for="sample-hardness"]').text()).toBe('硬度')
      expect(wrapper.find('label[for="sample-film-thickness"]').text()).toBe('膜厚')
      expect(wrapper.find('label[for="sample-feature"]').text()).toBe('特徴')
      expect(wrapper.find('label[for="sample-image"]').text()).toBe('画像')

      // 入力要素（テキスト）
      expect(wrapper.find('#sample-name').exists()).toBe(true)
      expect(wrapper.find('#sample-color').exists()).toBe(true)
      expect(wrapper.find('#sample-maker').exists()).toBe(true)
      expect(wrapper.find('#sample-hardness').exists()).toBe(true)
      expect(wrapper.find('#sample-film-thickness').exists()).toBe(true)
      expect(wrapper.find('#sample-feature').exists()).toBe(true)

      // 選択要素
      expect(wrapper.find('#sample-category').exists()).toBe(true)
      expect(wrapper.find('option[value=""]').text()).toBe('カテゴリーを選択して下さい')
      expect(wrapper.find('option[value="めっき"]').text()).toBe('めっき')
      expect(wrapper.find('option[value="陽極酸化"]').text()).toBe('陽極酸化')
      expect(wrapper.find('option[value="化成"]').text()).toBe('化成')
      expect(wrapper.find('option[value="コーティング"]').text()).toBe('コーティング')
      expect(wrapper.find('option[value="表面硬化"]').text()).toBe('表面硬化')
      
      // 画像埋め込み要素
      expect(wrapper.find('#preview-image').exists()).toBe(true)

      // 入力要素（ファイル）
      expect(wrapper.find('#sample-image').exists()).toBe(true)

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('登録')
    })

    it('外部リンクが表示されること', () => {
      expect(wrapper.findComponent({ ref: 'linkSamples' }).props().to).toBe('/samples')
      expect(wrapper.findComponent({ ref: 'linkSamples' }).text()).toBe('表面処理リストへ')
    })
  })

  describe('有効な情報を送信すると', () => {
    it('登録に成功すること', async () => {
      axios.post.mockResolvedValue({
        data: {
          id: 1,
          name: '無電解ニッケルめっき',
          category: 'めっき',
          color: 'イエローブラウンシルバー',
          maker: '合同会社小林通信',
          hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
          film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
          feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
          image_url: 'http://localhost:3000/electroless_nickel_plating.jpeg'
        }
      })

      wrapper = mount(SamplesNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      await wrapper.find('#sample-name').setValue('無電解ニッケルめっき')
      await wrapper.find('#sample-category').setValue('めっき')
      await wrapper.find('#sample-color').setValue('イエローブラウンシルバー')
      await wrapper.find('#sample-maker').setValue('合同会社小林通信')
      await wrapper.find('#sample-hardness').setValue('析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度')
      await wrapper.find('#sample-film-thickness').setValue('通常は3～5μm、厚めの場合は20～50μmまで可能')
      await wrapper.find('#sample-feature').setValue('耐食性・耐摩耗性・耐薬品性・耐熱性')

      await wrapper.find('form').trigger('submit.prevent')
      
      expect(axios.post).toHaveBeenCalled()
      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'success', text: '表面処理情報を1件登録しました。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/samples/1')
    })
  })

  describe('無効な情報で送信すると', () => {
    it('登録に失敗すること', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 422
        }
      })

      wrapper = mount(SamplesNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      await wrapper.find('#sample-name').setValue('')
      await wrapper.find('#sample-category').setValue('めっき')
      await wrapper.find('#sample-color').setValue('イエローブラウンシルバー')
      await wrapper.find('#sample-maker').setValue('合同会社小林通信')
      await wrapper.find('#sample-hardness').setValue('析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度')
      await wrapper.find('#sample-film-thickness').setValue('通常は3～5μm、厚めの場合は20～50μmまで可能')
      await wrapper.find('#sample-feature').setValue('耐食性・耐摩耗性・耐薬品性・耐熱性')

      await wrapper.find('form').trigger('submit.prevent')
      
      expect(wrapper.text()).toContain('入力に不備があります。')
    })
  })

  describe('画像添付', () => {
    beforeEach(async () => {
      wrapper = mount(SamplesNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        },
        attachTo: document.body
      })

      await flushPromises()
    })

    it('画像プレビューが表示されること', async () => {
      const file = new File(['dummy content'], 'electroless_nickel_plating.jpeg', { type: 'image/png' })

      const mockReadAsDataURL = vi.fn(function () {
        this.result = 'data:image/png;base64,dummy'
        this.onload({ target: this })
      })

      vi.stubGlobal('FileReader', class {
        constructor() {
          this.onload = null
        }
        readAsDataURL = mockReadAsDataURL
      })

      const input = wrapper.find('#sample-image')

      const inputEl = input.element

      Object.defineProperty(inputEl, 'files', {
        value: [file],
        writable: false
      })

      const event = new Event('change')
      inputEl.dispatchEvent(event)

      await flushPromises()

      const previewImage = wrapper.find('#preview-image')

      expect(previewImage.attributes('src')).toBe('data:image/png;base64,dummy')
    })
  })
})

