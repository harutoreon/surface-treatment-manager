import CategoriesEditView from '@/components/categories/CategoriesEditView.vue'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect,  vi, beforeEach } from 'vitest'
import axios from 'axios'

const replaceMock = vi.fn()
const pushMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', async () => {
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

describe('CategoriesEditView', () => {
  let wrapper

  describe('ログインチェックに成功した場合', () => {
    it('カテゴリー情報の編集ページに移動すること', async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            item: 'めっき',
            summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
          }
        })

      wrapper = mount(CategoriesEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('カテゴリー情報の編集')
    })
  })

  describe('ログインチェックに失敗した場合', () => {
    it('ログインページに移動すること', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 401
        }
      })

      wrapper = mount(CategoriesEditView, {
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
      expect(pushMock).not.toHaveBeenCalledWith(`/categories/${id}`)
    })
  })

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            item: 'めっき',
            summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
          }
        })

      wrapper = mount(CategoriesEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })
    
    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('カテゴリー情報の編集')
    })

    it('入力フォームが表示されること', () => {
      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      expect(wrapper.find('label[for="category-item"]').text()).toBe('カテゴリー名')
      expect(wrapper.find('label[for="category-summary"]').text()).toBe('概要')

      // 入力要素
      expect(wrapper.find('#category-item').exists()).toBe(true)
      expect(wrapper.find('#category-item').element.value).toBe('めっき')

      // テキストエリア要素
      expect(wrapper.find('#category-summary').exists()).toBe(true)
      expect(wrapper.find('#category-summary').element.value).toBe('金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。')

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('更新')
    })

    it('外部リンクが表示されること', () => {
      const routerLinks = wrapper.findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLinks[0].props().to).toBe('/categories/1')
      expect(routerLinks[1].props().to).toBe('/categories')

      // テキスト
      expect(routerLinks[0].text()).toBe('カテゴリー情報へ')
      expect(routerLinks[1].text()).toBe('カテゴリーリストへ')
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

      wrapper = mount(CategoriesEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: 'カテゴリー情報の取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('有効な情報を送信した場合', () => {
    it('更新が成功すること', async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            item: 'めっき',
            summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
          }
        })

      axios.patch.mockResolvedValue({
        data: {
          id: 1,
          item: '陽極酸化',
          summary: '人工的にアルミニウム表面に分厚い酸化アルミニウム被膜を作る処理のこと。'
        }
      })

      wrapper = mount(CategoriesEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      const inputItem = wrapper.find('#category-item')
      const inputSummary = wrapper.find('#category-summary')
      
      expect(inputItem.element.value).toBe('めっき')
      expect(inputSummary.element.value).toBe('金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。')
      
      await inputItem.setValue('陽極酸化')
      await inputSummary.setValue('人工的にアルミニウム表面に分厚い酸化アルミニウム被膜を作る処理のこと。')

      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'success', text: 'カテゴリー情報を更新しました。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/categories/1')
    })
  })

  describe('無効な情報を送信した場合', () => {
    it('更新が失敗すること', async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            item: 'めっき',
            summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
          }
        })

      axios.patch.mockRejectedValue({
        response: {
          status: 422
        }
      })

      wrapper = mount(CategoriesEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      const inputItem = wrapper.find('#category-item')
      const inputSummary = wrapper.find('#category-summary')
      
      expect(inputItem.element.value).toBe('めっき')
      expect(inputSummary.element.value).toBe('金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。')
      
      await inputItem.setValue('')
      await inputSummary.setValue('人工的にアルミニウム表面に分厚い酸化アルミニウム被膜を作る処理のこと。')

      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.text()).toContain('入力に不備があります。')
    })
  })
})
