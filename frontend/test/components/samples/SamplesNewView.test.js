import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import SamplesNewView from '@/components/samples/SamplesNewView.vue'
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
  describe('DOMの構造', () => {
    let wrapper

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

    it('見出しが存在すること', () => {
      expect(wrapper.find('h3').exists()).toBe(true)
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

    it('外部リンクが存在すること', () => {
      expect(wrapper.findComponent({ ref: 'linkSamples' }).props().to).toBe('/samples')
      expect(wrapper.findComponent({ ref: 'linkSamples' }).text()).toBe('表面処理リストへ')
    })
  })

  describe('API通信', () => {
    describe('有効な情報を送信すると', () => {
      it('登録が成功すること', async () => {
        axios.post.mockResolvedValue({
          data: {
            id: 1,
            name: '無電解ニッケルめっき'
          }
        })

        const wrapper = mount(SamplesNewView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(axios.post).toHaveBeenCalled()
        expect(wrapper.emitted()).toHaveProperty('message')
        expect(wrapper.emitted().message[0]).toEqual([
          { type: 'success', text: '表面処理情報を1件登録しました。' }
        ])
        expect(pushMock).toHaveBeenCalledWith('/samples/1')
      })
    })

    describe('空の状態で送信すると', () => {
      it('登録が失敗すること', async () => {
        axios.post.mockRejectedValue(new Error('Validation Error'))

        const wrapper = mount(SamplesNewView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(wrapper.text()).toContain('入力に不備があります。')
      })
    })
  })
})