import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import CategoriesIndexView from '@/components/categories/CategoriesIndexView.vue'
import axios from 'axios'

const replaceMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        replace: replaceMock
      }
    }
  }
})

describe('CategoriesIndexView', () => {
  let wrapper

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      axios.get.mockResolvedValue({
        data: [
          {
            id: 1,
            item: 'めっき',
            summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
          },
          {
            id: 2,
            item: '陽極酸化',
            summary: '人工的にアルミニウム表面に分厚い酸化アルミニウム被膜を作る処理のこと。'
          },
          {
            id: 3,
            item: '化成',
            summary: '金属の表面に処理剤を作用させて化学反応を起こさせる処理のこと。'
          },
          {
            id: 4,
            item: 'コーティング',
            summary: '溶射金属やセラミックスの粉末を、溶解状態にして製品表面に吹き付ける処理のこと。'
          },
          {
            id: 5,
            item: '表面硬化',
            summary: '主に金属材料に対して行われる、加熱・冷却・雰囲気により材料の性質を変化させる処理のこと。'
          }
        ]
      })

      wrapper = mount(CategoriesIndexView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('カテゴリーリスト')
    })

    it('ラベルが表示されること', () => {
      expect(wrapper.text()).toContain('カテゴリー名')
      expect(wrapper.text()).toContain('概要')
    })

    it('カテゴリーリストが表示されること', () => {
      // カテゴリー名
      expect(wrapper.text()).toContain('めっき')
      expect(wrapper.text()).toContain('陽極酸化')
      expect(wrapper.text()).toContain('化成')
      expect(wrapper.text()).toContain('コーティング')
      expect(wrapper.text()).toContain('表面硬化')

      // 概要
      expect(wrapper.text()).toContain('金属または非金属の材...')
      expect(wrapper.text()).toContain('人工的にアルミニウム...')
      expect(wrapper.text()).toContain('金属の表面に処理剤を...')
      expect(wrapper.text()).toContain('溶射金属やセラミック...')
      expect(wrapper.text()).toContain('主に金属材料に対して...')
    })

    it('外部リンクが表示されること', () => {
      const linkCategoriesNew = wrapper.findComponent({ ref: 'linkCategoriesNew' })
      const linkHome = wrapper.findComponent({ ref: 'linkHome' })
      
      // to属性
      expect(linkCategoriesNew.props().to).toBe('/categories/new')
      expect(linkHome.props().to).toBe('/home')
      
      // テキスト
      expect(linkCategoriesNew.text()).toBe('カテゴリー情報の登録')
      expect(linkHome.text()).toBe('メインメニューへ')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 404
        }
      })

      const wrapper = mount(CategoriesIndexView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: 'カテゴリーの取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })
})
