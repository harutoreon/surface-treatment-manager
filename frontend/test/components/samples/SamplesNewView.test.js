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

  describe('ログインチェックに成功した場合', () => {
    it('表面処理情報の登録ページに移動すること', async () => {
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

      wrapper = mount(SamplesNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('表面処理情報の登録')
    })
  })

  describe('ログインチェックに失敗した場合', () => {
    it('ログインページに移動すること', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 401
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

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: 'ログインが必要です。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/')
      expect(pushMock).not.toHaveBeenCalledWith('/categories')
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
            { id: 1, item: 'めっき' },
            { id: 2, item: '陽極酸化' },
            { id: 3, item: '化成' },
            { id: 4, item: 'コーティング' },
            { id: 5, item: '表面硬化' },
          ]
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

      wrapper = mount(SamplesNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
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
      expect(wrapper.find('label[for="sample-color"]').text()).toBe('色')
      expect(wrapper.find('label[for="makers"]').text()).toBe('メーカー')
      expect(wrapper.find('label[for="sample-hardness"]').text()).toBe('硬度')
      expect(wrapper.find('label[for="sample-film-thickness"]').text()).toBe('膜厚')
      expect(wrapper.find('label[for="sample-feature"]').text()).toBe('特徴')
      expect(wrapper.find('label[for="sample-summary"]').text()).toBe('概要')
      expect(wrapper.find('label[for="sample-image"]').text()).toBe('画像')

      // 入力要素（テキスト）
      expect(wrapper.find('#sample-name').exists()).toBe(true)
      expect(wrapper.find('#sample-color').exists()).toBe(true)
      expect(wrapper.find('#sample-hardness').exists()).toBe(true)
      expect(wrapper.find('#sample-film-thickness').exists()).toBe(true)
      expect(wrapper.find('#sample-feature').exists()).toBe(true)
      expect(wrapper.find('#sample-summary').exists()).toBe(true)

      // 選択要素
      expect(wrapper.find('#sample-category').exists()).toBe(true)
      expect(wrapper.find('option[value=""]').text()).toBe('カテゴリーを選択して下さい')
      expect(wrapper.find('option[value="めっき"]').text()).toBe('めっき')
      expect(wrapper.find('option[value="陽極酸化"]').text()).toBe('陽極酸化')
      expect(wrapper.find('option[value="化成"]').text()).toBe('化成')
      expect(wrapper.find('option[value="コーティング"]').text()).toBe('コーティング')
      expect(wrapper.find('option[value="表面硬化"]').text()).toBe('表面硬化')

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

      // 画像埋め込み要素
      expect(wrapper.find('#preview-image').exists()).toBe(true)

      // 入力要素（ファイル）
      expect(wrapper.find('#sample-image').exists()).toBe(true)

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('登録')
    })

    it('外部リンクが表示されること', () => {
      const routerLink = wrapper.findComponent(RouterLinkStub)

      expect(routerLink.props().to).toBe('/samples')
      expect(routerLink.text()).toBe('表面処理リストへ')
    })
  })

  describe('有効な情報を送信すると', () => {
    it('登録に成功すること', async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, item: 'めっき' },
            { id: 2, item: '陽極酸化' },
            { id: 3, item: '化成' },
            { id: 4, item: 'コーティング' },
            { id: 5, item: '表面硬化' },
          ]
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

      axios.post.mockResolvedValue({
        data: {
          id: 1,
          name: '無電解ニッケルめっき',
          category: 'めっき',
          color: 'イエローブラウンシルバー',
          maker: '東亜電化工業株式会社',
          hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
          film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
          feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
          summary: '電気を使わず化学反応で金属表面にニッケルを析出する技術です。',
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
      await wrapper.find('#makers').setValue('東亜電化工業株式会社')
      await wrapper.find('#sample-hardness').setValue('析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度')
      await wrapper.find('#sample-film-thickness').setValue('通常は3～5μm、厚めの場合は20～50μmまで可能')
      await wrapper.find('#sample-feature').setValue('耐食性・耐摩耗性・耐薬品性・耐熱性')
      await wrapper.find('#sample-summary').setValue('電気を使わず化学反応で金属表面にニッケルを析出する技術です。')

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
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, item: 'めっき' },
            { id: 2, item: '陽極酸化' },
            { id: 3, item: '化成' },
            { id: 4, item: 'コーティング' },
            { id: 5, item: '表面硬化' },
          ]
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
      await wrapper.find('#makers').setValue('東亜電化工業株式会社')
      await wrapper.find('#sample-hardness').setValue('析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度')
      await wrapper.find('#sample-film-thickness').setValue('通常は3～5μm、厚めの場合は20～50μmまで可能')
      await wrapper.find('#sample-feature').setValue('耐食性・耐摩耗性・耐薬品性・耐熱性')
      await wrapper.find('#sample-summary').setValue('電気を使わず化学反応で金属表面にニッケルを析出する技術です。')

      await wrapper.find('form').trigger('submit.prevent')
      
      expect(wrapper.text()).toContain('入力に不備があります。')
    })
  })

  describe('画像添付', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, item: 'めっき' },
            { id: 2, item: '陽極酸化' },
            { id: 3, item: '化成' },
            { id: 4, item: 'コーティング' },
            { id: 5, item: '表面硬化' },
          ]
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

    describe('ファイルの容量が5MB未満の場合', () => {
      it('プレビューが表示されること', async () => {
        const file = new File(['a'.repeat(4_000_000)], 'small.jpg', { type: 'image/jpeg' })
        const inputEl = wrapper.find('#sample-image').element

        const mockReadAsDataURL = vi.fn(function () {
          this.result = 'data:image/jpeg;base64,preview'
          this.onload({ target: this })
        })
        vi.stubGlobal('FileReader', class {
          constructor() {
            this.onload = null
          }
          readAsDataURL = mockReadAsDataURL
        })

        Object.defineProperty(inputEl, 'files', { value: [file], writable: false })
        inputEl.dispatchEvent(new Event('change'))

        await flushPromises()

        expect(wrapper.text()).not.toContain('5MB未満のファイルに変更して下さい。')
        expect(wrapper.find('#preview-image').attributes('src')).toBe('data:image/jpeg;base64,preview')
      })
    })

    describe('ファイルの容量が5MBを超える場合', () => {
      it('エラーメッセージを表示してプレビューが表示されないこと', async () => {
        const file = new File(['a'.repeat(6_000_000)], 'large.jpg', { type: 'image/jpeg' })
        const inputEl = wrapper.find('#sample-image').element

        Object.defineProperty(inputEl, 'files', { value: [file], writable: false })
        inputEl.dispatchEvent(new Event('change'))

        await flushPromises()

        expect(wrapper.text()).toContain('5MB未満のファイルに変更して下さい。')
        expect(wrapper.find('#preview-image').attributes('src')).toBe('')
      })
    })
  })
})
