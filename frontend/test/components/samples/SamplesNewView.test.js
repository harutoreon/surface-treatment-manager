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

      expect(wrapper.find('#label_sample_image').exists()).toBe(true)
      expect(wrapper.find('#label_sample_image').text()).toBe('画像')
    })

    it('すべてのテキスト入力が存在すること', () => {
      expect(wrapper.find('#sample_name').exists()).toBe(true)
      expect(wrapper.find('#sample_color').exists()).toBe(true)
      expect(wrapper.find('#sample_maker').exists()).toBe(true)
      expect(wrapper.find('#sample_hardness').exists()).toBe(true)
      expect(wrapper.find('#sample_film_thickness').exists()).toBe(true)
      expect(wrapper.find('#sample_feature').exists()).toBe(true)
    })

    it('ドロップダウンリストが存在すること', () => {
      expect(wrapper.find('#sample_category').exists()).toBe(true)
      expect(wrapper.find('option[value=""]').text()).toBe('')
      expect(wrapper.find('option[value="めっき"]').text()).toBe('めっき')
      expect(wrapper.find('option[value="陽極酸化"]').text()).toBe('陽極酸化')
      expect(wrapper.find('option[value="化成"]').text()).toBe('化成')
      expect(wrapper.find('option[value="コーティング"]').text()).toBe('コーティング')
      expect(wrapper.find('option[value="表面硬化"]').text()).toBe('表面硬化')
    })

    it('画像プレビューが存在すること', () => {
      expect(wrapper.find('#preview_image').exists()).toBe(true)
    })

    it('ファイル選択が存在すること', () => {
      expect(wrapper.find('#sample_image').exists()).toBe(true)
    })

    it('ボタンが存在すること', () => {
      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.find('button').text()).toBe('登録')
    })

    it('外部リンクが存在すること', () => {
      expect(wrapper.findComponent({ ref: 'linkSamples' }).props().to).toBe('/samples')

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