import { mount } from '@vue/test-utils'
import SettingsView from '@/components/settings/SettingsView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const context = describe

describe('SettingsView.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(SettingsView, {
      global: {
        stubs: {
          RouterLink: true
        }
      }
    })
  })

  context('ログアウトの選択でOKを押した場合', () => {
    it('logoutイベントが発火すること', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true)
    
      await wrapper.find('button').trigger('click')
      
      expect(wrapper.emitted('logout')).toBeTruthy()
    })
  })

  context('ログアウトの選択でキャンセルを押した場合', () => {
    it('logoutイベントが発火しないこと', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false)
    
      await wrapper.find('button').trigger('click')
      
      expect(wrapper.emitted('logout')).toBeFalsy()
    })
  })
})
