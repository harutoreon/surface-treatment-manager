import SettingsView from '@/components/settings/SettingsView.vue'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'

const replaceMock = vi.fn()
const pushMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        replace: replaceMock,
        push: pushMock
      }
    }
  }
})

afterEach(() => {
  pushMock.mockClear()
})

describe('SettingsView', () => {
  let wrapper

  describe('初期レンダリング', () => {
    beforeEach(async () => {
      wrapper = mount(SettingsView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('アプリケーションの管理')
    })

    it('ログアウトボタンが表示されること', () => {
      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.find('h6').text()).toBe('ログアウト')
      expect(wrapper.find('small').text()).toBe('アプリケーションからログアウトします。')
    })

    it('外部リンクが表示されること', () => {
      const routerLink = wrapper.findComponent(RouterLinkStub)

      expect(routerLink.props().to).toBe('/home')
      expect(routerLink.text()).toBe('メインメニューへ')
    })
  })

  describe('ログアウトの選択でOKを押した場合', () => {
    it('ログインページに遷移すること', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true)

      wrapper = mount(SettingsView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      await wrapper.find('button').trigger('click')

      expect(pushMock).toHaveBeenCalledWith('/')
    })
  })

  describe('ログアウトの選択でキャンセルを押した場合', () => {
    it('ログインページに遷移しないこと', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false)

      wrapper = mount(SettingsView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    
      await wrapper.find('button').trigger('click')
      
      expect(pushMock).not.toHaveBeenCalledWith('/')
    })
  })
})
