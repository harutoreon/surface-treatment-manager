import SettingsView from '@/components/settings/SettingsView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'

const pushMock = vi.fn()

vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock
      }
    }
  }
})

const confirmMock = vi.fn()
vi.stubGlobal('confirm', confirmMock)

describe('SettingsView', () => {
  let wrapper

  beforeEach( () => {
    vi.clearAllMocks()
    wrapper = mount(SettingsView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })
  })

  describe('ログアウトの選択でOKを押した場合', () => {
    it('ログインページに遷移すること', async () => {
      confirmMock.mockReturnValue(true)

      await wrapper.find('button').trigger('click')

      expect(pushMock).toHaveBeenCalledWith('/')
    })
  })

  describe('ログアウトの選択でキャンセルを押した場合', () => {
    it('ページ遷移が発生しないこと', async () => {
      confirmMock.mockReturnValue(false)

      await wrapper.find('button').trigger('click')
      
      expect(pushMock).not.toHaveBeenCalled()
    })
  })
})
