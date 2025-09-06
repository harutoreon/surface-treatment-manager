import UsersIndexView from '@/components/users/UsersIndexView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const replacdMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        query: { page: 1 }
      }
    },
    useRouter: () => {
      return {
        replace: replacdMock
      }
    }
  }
})

describe('UsersIndexView', () => {
  let wrapper

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      axios.get.mockResolvedValue({
        data: {
          users: [
            { id: 1, name: '佐藤 海翔', department: '品質管理部' },
            { id: 1, name: '高橋 陽菜', department: '製造部' },
            { id: 1, name: '中村 蒼真', department: '品質管理部' },
            { id: 1, name: '伊藤 美月', department: '製造部' },
            { id: 1, name: '山口 大和', department: '営業部' },
            { id: 1, name: '田中 結衣', department: '開発部' },
            { id: 1, name: '渡辺 陸斗', department: '品質管理部' },
            { id: 1, name: '小林 桜子', department: '製造部' },
            { id: 1, name: '加藤 拓真', department: '開発部' },
            { id: 1, name: '山本 柚希', department: '営業部' }
          ],
          current_page: 1,
          total_pages: 1
        }
      })

      wrapper = mount(UsersIndexView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('ユーザーリスト')
    })

    it('ユーザーリストが表示されること', async () => {
      // ユーザー名
      expect(wrapper.text()).toContain('佐藤 海翔')
      expect(wrapper.text()).toContain('高橋 陽菜')
      expect(wrapper.text()).toContain('中村 蒼真')
      expect(wrapper.text()).toContain('伊藤 美月')
      expect(wrapper.text()).toContain('山口 大和')
      expect(wrapper.text()).toContain('田中 結衣')
      expect(wrapper.text()).toContain('渡辺 陸斗')
      expect(wrapper.text()).toContain('小林 桜子')
      expect(wrapper.text()).toContain('加藤 拓真')
      expect(wrapper.text()).toContain('山本 柚希')

      // 部署名
      expect(wrapper.text().match(/品質管理部/g).length).toBe(3)
      expect(wrapper.text().match(/製造部/g).length).toBe(3)
      expect(wrapper.text().match(/営業部/g).length).toBe(2)
      expect(wrapper.text().match(/営業部/g).length).toBe(2)
    })

    it('ページネーションが表示こと', () => {
      expect(wrapper.text()).toContain('前ページ')
      expect(wrapper.text()).toContain('次ページ')
      expect(wrapper.find('a[class="page-link"]').text()).toBe('1')
    })

    it('外部リンクが表示されること', () => {
      const div = wrapper.find('div[class="d-flex justify-content-evenly"]')
      const routerLinks = div.findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLinks[0].props().to).toBe('/users/new')
      expect(routerLinks[1].props().to).toBe('/home')

      // テキスト
      expect(routerLinks[0].text()).toBe('ユーザー情報の登録')
      expect(routerLinks[1].text()).toBe('メインメニューへ')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 404
        }
      })

      wrapper = mount(UsersIndexView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: 'ユーザーリストの取得に失敗しました。' }
      ])
      expect(replacdMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })
})
